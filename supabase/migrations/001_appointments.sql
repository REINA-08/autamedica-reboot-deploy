-- =============================
-- 001_appointments.sql (idempotente)
-- =============================
create extension if not exists btree_gist;

-- Tabla principal
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete restrict,
  doctor_id  uuid not null references public.doctors(id)  on delete restrict,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null check (ends_at > starts_at),
  status     text not null check (status in (
    'scheduled','confirmed','in-progress','completed','cancelled','no-show','rescheduled'
  )),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices habituales
create index if not exists idx_appointments_doctor_starts on public.appointments(doctor_id, starts_at);
create index if not exists idx_appointments_patient_starts on public.appointments(patient_id, starts_at);

-- Slot de rango + antisolape por doctor
alter table public.appointments
  add column if not exists slot tstzrange
  generated always as (tstzrange(starts_at, ends_at, '[)')) stored;

create index if not exists idx_appointments_slot_gist on public.appointments using gist (doctor_id, slot);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'no_overlap_per_doctor'
  ) then
    alter table public.appointments
      add constraint no_overlap_per_doctor
      exclude using gist (doctor_id with =, slot with &&);
  end if;
end $$;

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

-- RLS
alter table public.appointments enable row level security;

-- Policies (idempotentes)
do $$
begin
  if not exists (select 1 from pg_policies where polname='patient_can_view_own') then
    create policy "patient_can_view_own" on public.appointments
    for select using (auth.uid() = patient_id);
  end if;

  if not exists (select 1 from pg_policies where polname='patient_can_crud_own') then
    create policy "patient_can_crud_own" on public.appointments
    for all using (auth.uid() = patient_id) with check (auth.uid() = patient_id);
  end if;

  if not exists (select 1 from pg_policies where polname='doctor_can_view_related') then
    create policy "doctor_can_view_related" on public.appointments
    for select using (
      exists (select 1 from public.doctor_patient dp
      where dp.doctor_id = auth.uid() and dp.patient_id = appointments.patient_id)
    );
  end if;

  if not exists (select 1 from pg_policies where polname='doctor_can_crud_related') then
    create policy "doctor_can_crud_related" on public.appointments
    for all using (
      exists (select 1 from public.doctor_patient dp
      where dp.doctor_id = auth.uid() and dp.patient_id = appointments.patient_id)
    )
    with check (
      exists (select 1 from public.doctor_patient dp
      where dp.doctor_id = auth.uid() and dp.patient_id = appointments.patient_id)
    );
  end if;
end $$;

-- RPC: verificar solapes
create or replace function public.check_appointment_overlap(
  p_doctor uuid, p_start timestamptz, p_end timestamptz
) returns table(id uuid, starts_at timestamptz, ends_at timestamptz)
language sql stable as $$
  select a.id, a.starts_at, a.ends_at
  from public.appointments a
  where a.doctor_id = p_doctor
    and tstzrange(p_start, p_end, '[)') && a.slot
$$;

-- RPC: crear con check de solape
create or replace function public.create_appointment_safe(
  p_patient uuid, p_doctor uuid, p_start timestamptz, p_end timestamptz,
  p_status text, p_notes text
) returns uuid language plpgsql as $$
declare new_id uuid;
begin
  if exists (
    select 1 from public.appointments
    where doctor_id = p_doctor
      and tstzrange(p_start, p_end, '[)') && slot
  ) then
    raise exception 'OVERLAP';
  end if;

  insert into public.appointments(patient_id, doctor_id, starts_at, ends_at, status, notes)
  values (p_patient, p_doctor, p_start, p_end, coalesce(p_status,'scheduled'), p_notes)
  returning id into new_id;

  return new_id;
end; $$;