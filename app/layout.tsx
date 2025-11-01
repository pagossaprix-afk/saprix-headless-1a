import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Importamos los nuevos componentes
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      {/* Usamos flex pa' empujar el Footer pa' abajo (min-h-screen)
          y flex-col pa' apilarlos (Navbar, Contenido, Footer)
        */}
      <body className={`${inter.variable} font-inter bg-saprix-black-blue text-saprix-white`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
