import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "JatinangorAman — Peta Zona Keamanan & Kelayakan Kos",
  description:
    "Web-GIS interaktif pemetaan zona keamanan dan kelayakan hunian kos di kawasan Jatinangor berbasis model AHP-TOPSIS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="font-sans antialiased overflow-hidden select-none sm:select-auto">
        {children}
      </body>
    </html>
  );
}
