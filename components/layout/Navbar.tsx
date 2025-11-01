// En /components/layout/Navbar.tsx
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; // Icono del carrito

export default function Navbar() {
  return (
    <nav className="w-full bg-saprix-black-blue border-b border-saprix-indigo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Temporal como Texto) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-saprix-electric-blue">
              SAPRIX 1A
            </Link>
          </div>

          {/* Links de Navegación (Categorías de la Biblia) */}
          <div className="hidden md:flex md:space-x-8">
            <Link href="/tienda/zapatillas" className="text-saprix-white hover:text-saprix-electric-blue transition-colors">
              Zapatillas
            </Link>
            <Link href="/tienda/ropa" className="text-saprix-white hover:text-saprix-electric-blue transition-colors">
              Ropa
            </Link>
            <Link href="/tienda/accesorios" className="text-saprix-white hover:text-saprix-electric-blue transition-colors">
              Accesorios
            </Link>
            <Link href="/tienda/balones" className="text-saprix-white hover:text-saprix-electric-blue transition-colors">
              Balones
            </Link>
          </div>

          {/* Icono de Carrito */}
          <div className="flex items-center">
            <Link href="/carrito" className="text-saprix-white hover:text-saprix-electric-blue transition-colors">
              <ShoppingBag size={24} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}