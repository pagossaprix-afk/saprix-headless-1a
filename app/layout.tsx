import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Theme Provider
import { ThemeProvider } from "@/components/ThemeProvider";

// Layout Components
import FutsalHeader from "@/components/layout/FutsalHeader";
import HeaderMobileClient from "@/components/layout/HeaderMobileClient";
import DixorFooter from "@/components/layout/Footer";
import NewCollectionCountdown from "@/components/home/NewCollectionCountdown";
import CustomCursor from "@/components/ui/CustomCursor";

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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="flex flex-col min-h-screen">
            <CustomCursor />
            <HeaderMobileClient />
            <FutsalHeader />
            <main className="flex-grow">{children}</main>
            <NewCollectionCountdown />
            <DixorFooter />
          </div>
        </ThemeProvider>
      </body>
    </html >
  );
}
