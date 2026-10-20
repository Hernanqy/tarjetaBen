import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ben cumple 7",
  description:
    "Te esperamos para festejar los 7 de Ben.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}