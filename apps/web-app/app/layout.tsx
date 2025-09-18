import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from "../src/components/providers/ClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "AutaMedica - Telemedicina Avanzada",
  description: "Plataforma de telemedicina que conecta pacientes con profesionales de la salud a través de tecnología segura y conforme con HIPAA.",
  keywords: "telemedicina, medicina, salud, consultas online, HIPAA, AutaMedica",
  authors: [{ name: "E.M Medicina - UBA" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
