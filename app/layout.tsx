import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configurar la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Saprix E-commerce 1A",
  description: "Todo para Futsal: Zapatillas, Balones y Más",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicar la fuente y el fondo "Dark Performance" */}
      <body className={`${inter.variable} font-inter bg-saprix-black-blue text-saprix-white`}>
        {children}
      </body>
    </html>
  );
}
