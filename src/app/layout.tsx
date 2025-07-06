import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout/MainLayout";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nomrezade.az - Sizin Nömrələriniz bizdə",
  description: "Azərbaycanın ən böyük nömrə bazarı",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body
        className={`${archivo.variable} antialiased`}
      >
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
