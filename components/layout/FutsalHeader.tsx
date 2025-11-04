"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Popover, Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCartOutline, IoHeartOutline, IoPersonCircleOutline, IoMenuOutline, IoClose } from "react-icons/io5";
import { ChevronDown, List, Search, Flame, Star, ShoppingCart } from "lucide-react";

// Paleta Saprix: fondo azul de marca, texto blanco en azules y hover rojo‑naranja
const brand = {
  topBg: "bg-white",
  topText: "text-gray-900",
  accent: "text-saprix-red-orange",
  bottomBg: "bg-blue-600", // Fondo confirmado por ti; acentos siguen usando #2500ff
  navText: "text-white",
};

const navItems = [
  { name: "Hombre", href: "/tienda?hombre", submenu: [
    { name: "Zapatillas Sala", href: "/tienda?hombre&cat=zapatillas" },
    { name: "Ofertas", href: "/tienda?hombre&cat=ofertas" },
  ]},
  { name: "Mujer", href: "/tienda?mujer", submenu: [
    { name: "Zapatillas Sala", href: "/tienda?mujer&cat=zapatillas" },
    { name: "Ofertas", href: "/tienda?mujer&cat=ofertas" },
  ]},
  { name: "Niños", href: "/tienda?ninos", submenu: [
    { name: "Zapatillas Sala", href: "/tienda?ninos&cat=zapatillas" },
    { name: "Ofertas", href: "/tienda?ninos&cat=ofertas" },
  ]},
  { name: "Ofertas", href: "/ofertas" },
];

export default function FutsalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior: blanca + buscador + soporte (Saprix) */}
      <div className={`${brand.topBg} ${brand.topText}`}>
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="grid grid-cols-12 items-center gap-4">
            {/* Logo Saprix (retina) */}
            <div className="col-span-3">
              <Link href="/" className="inline-flex items-center gap-3" aria-label="Inicio Saprix">
                <Image
                  src="https://pagos.saprix.com.co/wp-content/uploads/2022/09/Logo-Saprix-nuevo-retina.png"
                  alt="Logo-Saprix"
                  width={160}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Búsqueda tipo 'Todas las categorías' */}
            <div className="col-span-6">
              <form action="/tienda" role="search" aria-label="Buscar">
                <div className="flex w-full items-center rounded-full border border-gray-300 bg-white px-2 py-1 shadow-sm">
                  <button type="button" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-50">
                    <span className="font-semibold">Todas las categorías</span>
                    <ChevronDown size={16} className="text-saprix-red-orange" />
                  </button>
                  <span className="mx-2 h-6 w-px bg-gray-300" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Buscar productos"
                    className="h-10 flex-1 border-none bg-transparent px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <span className="inline-flex h-10 w-10 items-center justify-center">
                    <Search size={18} className="text-saprix-red-orange" />
                  </span>
                </div>
              </form>
            </div>

            {/* Soporte 24/7 */}
            <div className="col-span-3">
              <div className="flex items-center justify-end gap-3">
                <IoPersonCircleOutline className="h-8 w-8 text-saprix-red-orange" />
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Soporte 24/7</span>
                  <p className="font-bold text-gray-900">+57 304 3136608</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior: azul de marca + navegación en blanco y botón de categorías blanco */}
      <div className={`${brand.bottomBg}`}>
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Botón Products Category */}
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-gray-900 shadow-md hover:shadow-lg"
                  >
                    <List size={18} className="text-saprix-red-orange" />
                    <span>Categorías de productos</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} className="text-saprix-red-orange" />
                    </motion.span>
                  </Popover.Button>
                  <AnimatePresence>
                    {open && (
                      <Popover.Panel static as={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 z-50 mt-3 w-[640px] overflow-hidden rounded-lg bg-white p-6 text-gray-900 shadow-xl"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["Sala Classics","Speed","Grip","Kids","Women","Accessories"].map((name) => (
                            <Link key={name} href={`/tienda?cat=${encodeURIComponent(name)}`} className="block">
                              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-md hover:shadow-lg">
                                <Star size={18} className="text-saprix-red-orange" />
                                <span className="text-sm font-semibold text-gray-900">{name}</span>
                              </motion.div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link href="/tienda/categorias" className="text-sm font-semibold text-saprix-red-orange hover:text-saprix-red-orange/80">Ver más...</Link>
                        </div>
                      </Popover.Panel>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>

            {/* Separador vertical sobre azul */}
            <span className="hidden lg:block h-6 w-px bg-white/40" />

            {/* Navegación negra con separadores */}
            <nav className="hidden items-center gap-4 font-semibold lg:flex">
              {[
                { name: "Inicio", href: "/" },
                { name: "Tienda", href: "/tienda" },
                { name: "Blog", href: "/blog" },
                { name: "Páginas", href: "/pages" },
                { name: "Contacto", href: "/contacto" },
              ].map((item, idx, arr) => (
                <div key={item.name} className="flex items-center">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button as={motion.button} whileHover={{ scale: 1.05 }} className="flex items-center gap-1 text-white hover:text-saprix-red-orange active:text-saprix-red-orange">
                          <span>{item.name}</span>
                          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={14} className="text-saprix-red-orange" />
                          </motion.span>
                        </Popover.Button>
                        <AnimatePresence>
                          {open && (
                            <Popover.Panel static as={motion.div}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 z-50 mt-3 min-w-[240px] overflow-hidden rounded-md bg-white p-3 text-gray-800 shadow-xl"
                            >
                              <ul className="space-y-1">
                                {["Zapatillas","Ropa","Accesorios"].map((n) => (
                                  <li key={`${item.name}-${n}`}>
                                    <Link href={`/tienda?from=${item.name.toLowerCase()}&cat=${encodeURIComponent(n)}`} className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-saprix-red-orange">
                                      {n}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </Popover.Panel>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </Popover>
                  {idx < arr.length - 1 && (<span className="mx-3 text-white/60">|</span>)}
                </div>
              ))}
            </nav>

            {/* Iconos derecha: ofertas, favoritos y carrito sobre fondo azul */}
            <div className="flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/deals" className="flex items-center gap-2 font-bold text-white hover:text-saprix-red-orange active:text-saprix-red-orange">
                  <Flame size={18} className="text-saprix-red-orange" />
                  <span>Ofertas</span>
                </Link>
              </motion.div>
              <Star size={18} className="text-saprix-red-orange" />
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/wishlist" className="relative text-white hover:text-saprix-red-orange" aria-label="Favoritos">
                  <IoHeartOutline className="h-6 w-6" />
                  <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saprix-red-orange text-xs text-white">12</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/carrito" className="relative text-white hover:text-saprix-red-orange" aria-label="Carrito">
                  <ShoppingCart size={18} />
                  <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saprix-red-orange text-xs text-white">01</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú Mobile (Drawer simple) */}
      <Dialog open={mobileOpen} onClose={() => setMobileOpen(false)} className="relative z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-y-0 left-0 w-72 bg-neutral-900 p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Saprix</span>
            <button aria-label="Cerrar" onClick={() => setMobileOpen(false)}>
              <IoClose className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <Link key={`m-${item.name}`} href={item.href} className="block rounded-md px-3 py-2 hover:bg-white/10">
                {item.name}
              </Link>
            ))}
            <div className="mt-4 border-t border-white/10 pt-4">
              <Link href="/cuenta" className="block rounded-md px-3 py-2 hover:bg-white/10">Cuenta</Link>
              <Link href="/wishlist" className="block rounded-md px-3 py-2 hover:bg-white/10">Favoritos</Link>
              <Link href="/carrito" className="block rounded-md px-3 py-2 hover:bg-white/10">Carrito</Link>
            </div>
          </nav>
        </div>
      </Dialog>
    </header>
  );
}