import type { ISODateString } from "./scalars";

// API Response como unión discriminada
export type APIResponse<T = unknown> =
  | { ok: true; data: T; timestamp: ISODateString }
  | { ok: false; error: string; code?: string; timestamp: ISODateString };