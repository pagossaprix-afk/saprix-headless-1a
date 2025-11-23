'use client';

// En /components/layout/Footer.tsx
import SaprixLogo from "@/components/ui/SaprixLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-saprix-black-blue border-t border-saprix-indigo mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo negativo (blanco) sobre fondo oscuro, aumentado 25% */}
        <div className="flex justify-center mb-4">
          <SaprixLogo bg="dark" retina width={200} height={50} />
        </div>
        <div className="text-center text-sm text-saprix-indigo">
          &copy; {currentYear} Saprix.com.co. Todos los derechos reservados.
          <br />
          Desarrollado Nivel Dios por Proyectos iAnGo S.A.S..
        </div>
      </div>
    </footer>
  );
}