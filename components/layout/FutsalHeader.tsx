"use client";

import Link from "next/link";
import Image from "next/image";
import SaprixLogo from "@/components/ui/SaprixLogo";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Popover } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoHeartOutline, IoPersonCircleOutline, IoMenuOutline, IoShirt } from "react-icons/io5";
import { GiTravelDress, GiRunningShoe, GiSocks } from "react-icons/gi";
import { FaMinusCircle } from "react-icons/fa";
import { ChevronDown, List, Search, Flame, ShoppingCart, User, UserCircle, Truck, Package, HelpCircle, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

// Paleta Saprix: fondo azul de marca, texto blanco en azules y hover rojo‑naranja
const brand = {
  topBg: "bg-white",
  topText: "text-gray-900",
  accent: "text-saprix-red-orange",
  bottomBg: "bg-saprix-electric-blue", // Azul eléctrico Saprix (#2500ff)
  navText: "text-white",
};

// Categorías con paleta colorida (en español)
const categories = [
  { name: "Camisas Hombre", Icon: IoShirt, href: "/tienda?category=camisas-hombre", color: "#2500ff" },
    { name: "Vestidos Mujer", Icon: GiTravelDress, href: "/tienda?category=vestidos-mujer", color: "#FF4500" },
  { name: "Zapatillas Running", Icon: GiRunningShoe, href: "/tienda?category=zapatillas-running", color: "#00B341" },
  { name: "Medias", Icon: GiSocks, href: "/tienda?category=medias", color: "#8A2BE2" },
  { name: "Sala Clásicos", Icon: IoShirt, href: "/tienda?category=sala-classics", color: "#1E90FF" },
  { name: "Velocidad", Icon: GiRunningShoe, href: "/tienda?category=velocidad", color: "#FF9500" },
  { name: "Agarre", Icon: GiRunningShoe, href: "/tienda?category=agarre", color: "#00C2FF" },
  { name: "Niños", Icon: IoShirt, href: "/tienda?category=ninos", color: "#FF3E7F" },
];

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState<{
    productos: Array<{ slug: string; nombre: string; imagen: string; precio: string }>;
    categorias: Array<{ nombre: string; slug: string; count: number }>;
    paginas: Array<{ nombre: string; href: string }>;
  }>({ productos: [], categorias: [], paginas: [] });
  const [loadingSug, setLoadingSug] = useState(false);
  const [showSug, setShowSug] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const accountBtnRef = useRef<HTMLButtonElement | null>(null);
  const [hoverNav, setHoverNav] = useState<string | null>(null);

  useEffect(() => {
    try {
      const wc = parseInt(localStorage.getItem("wishlistCount") || "0");
      const cc = parseInt(localStorage.getItem("cartCount") || "0");
      setWishlistCount(isNaN(wc) ? 0 : wc);
      setCartCount(isNaN(cc) ? 0 : cc);
    } catch {}
    const handler = (e: StorageEvent) => {
      if (e.key === "wishlistCount") setWishlistCount(parseInt(e.newValue || "0") || 0);
      if (e.key === "cartCount") setCartCount(parseInt(e.newValue || "0") || 0);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Autocompletado con debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions({ productos: [], categorias: [], paginas: [] });
      setLoadingSug(false);
      return;
    }
    setLoadingSug(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&per_page=6`, { signal: ctrl.signal });
        const json = await res.json();
        setSuggestions({
          productos: Array.isArray(json?.productos) ? json.productos : [],
          categorias: Array.isArray(json?.categorias) ? json.categorias : [],
          paginas: Array.isArray(json?.paginas) ? json.paginas : [],
        });
      } catch {
        // Ignorar errores/abort
      } finally {
        setLoadingSug(false);
        setShowSug(true);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [searchQuery]);

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && !wrapRef.current.contains(t)) {
        setShowSug(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Formateo de moneda según configuración
  const moneyFmt = useMemo(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || "es-CO";
    const currency = process.env.NEXT_PUBLIC_CURRENCY || "COP";
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency });
    } catch {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" });
    }
  }, []);

  return (
    <header className="hidden lg:block sticky top-0 z-50">
      {/* Barra superior: blanca + buscador + soporte (Saprix) */}
      <div className={`${brand.topBg} ${brand.topText}`}>
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="grid grid-cols-12 items-center gap-4">
            {/* Logo Saprix (retina) */}
            <div className="col-span-3">
              <Link href="/" className="inline-flex items-center gap-3" aria-label="Inicio Saprix">
                {/* Fondo blanco => logo normal azul (aumentado 25%) */}
                <SaprixLogo bg="light" retina width={200} height={50} />
              </Link>
            </div>

            {/* Búsqueda tipo 'Todas las categorías' */}
            <div className="col-span-6 relative" ref={wrapRef}>
              <form
                role="search"
                aria-label="Buscar"
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = searchQuery.trim();
                  router.push(q ? `/tienda?q=${encodeURIComponent(q)}` : "/tienda");
                }}
              >
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSug(true)}
                    className="h-10 flex-1 border-none bg-transparent px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <span className="inline-flex h-10 w-10 items-center justify-center">
                    <Search size={18} className="text-saprix-red-orange" />
                  </span>
                </div>
              </form>

              {/* Panel de sugerencias */}
              <AnimatePresence>
                {showSug && (suggestions.productos.length + suggestions.categorias.length + suggestions.paginas.length) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg bg-white shadow-xl"
                  >
                    <div className="max-h-80 overflow-auto">
                      {/* Productos */}
                      <div>
                        <div className="px-3 pt-3 text-xs font-semibold text-gray-500">Productos</div>
                        <ul className="divide-y divide-gray-100">
                          {suggestions.productos.length === 0 && (
                            <li className="p-3 text-sm text-gray-500">Sin productos para “{searchQuery}”.</li>
                          )}
                          {suggestions.productos.map((s) => (
                            <li key={`prod-${s.slug}`} className="hover:bg-gray-50">
                              <Link href={`/producto/${s.slug}`} className="flex items-center gap-3 px-3 py-2" onClick={() => setShowSug(false)}>
                                <img src={s.imagen} alt={s.nombre} className="h-8 w-8 rounded object-cover" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{s.nombre}</p>
                                  {s.precio ? (
                                    <p className="text-xs text-gray-500">{moneyFmt.format(Number(s.precio))}</p>
                                  ) : null}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Categorías */}
                      <div>
                        <div className="px-3 pt-3 text-xs font-semibold text-gray-500">Categorías</div>
                        <ul className="divide-y divide-gray-100">
                          {suggestions.categorias.length === 0 && (
                            <li className="p-3 text-sm text-gray-500">Sin categorías para “{searchQuery}”.</li>
                          )}
                          {suggestions.categorias.map((c) => (
                            <li key={`cat-${c.slug}`} className="hover:bg-gray-50">
                              <Link href={`/tienda?category=${encodeURIComponent(c.slug)}`} className="flex items-center gap-3 px-3 py-2" onClick={() => setShowSug(false)}>
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-sm text-gray-600">#</div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{c.nombre}</p>
                                  {typeof c.count === "number" && (
                                    <p className="text-xs text-gray-500">{c.count} productos</p>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Páginas */}
                      <div>
                        <div className="px-3 pt-3 text-xs font-semibold text-gray-500">Páginas</div>
                        <ul className="divide-y divide-gray-100">
                          {suggestions.paginas.length === 0 && (
                            <li className="p-3 text-sm text-gray-500">Sin páginas para “{searchQuery}”.</li>
                          )}
                          {suggestions.paginas.map((p, idx) => (
                            <li key={`page-${idx}`} className="hover:bg-gray-50">
                              <Link href={p.href} className="flex items-center gap-3 px-3 py-2" onClick={() => setShowSug(false)}>
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-sm text-gray-600">📄</div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{p.nombre}</p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="border-t p-2 text-right">
                      <Link href={`/tienda?q=${encodeURIComponent(searchQuery.trim())}`} className="text-sm font-semibold text-saprix-red-orange hover:underline">
                        Ver todos los resultados
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {showSug && loadingSug && (
                <div className="absolute left-0 right-0 mt-2 rounded-md bg-white p-3 text-sm text-gray-500 shadow">
                  Buscando…
                </div>
              )}
            </div>

            {/* Soporte 24/7 + Cuenta */}
            <div className="col-span-3">
              <div className="flex items-center justify-end gap-3">
                <div>
                  <span className="block text-xs font-semibold text-gray-500">Soporte 24/7</span>
                  <p className="font-bold text-gray-900">+57 304 3136608</p>
                </div>
                {/* Cuenta en barra blanca con Popover (hover) */}
                <Popover className="relative">
                  {({ open }) => (
                    <div
                      onMouseEnter={() => { if (!open) accountBtnRef.current?.click(); }}
                      onMouseLeave={() => { if (open) accountBtnRef.current?.click(); }}
                    >
                      <Popover.Button
                        ref={accountBtnRef}
                        as={motion.button}
                        whileHover={{ scale: 1.05 }}
                        aria-label="Cuenta"
                        className="rounded-full border border-gray-300 bg-white p-2 text-saprix-electric-blue hover:border-saprix-electric-blue"
                      >
                        <User size={18} className="text-saprix-electric-blue" />
                      </Popover.Button>
                      <AnimatePresence>
                        {open && (
                          <Popover.Panel static className="absolute right-0 z-50 mt-3 w-64 sm:w-72 md:w-80 max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-lg">
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="p-3">
                              <button className="mb-3 w-full rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-yellow-500">
                                Ingresar o Registrarse
                              </button>
                              <ul className="divide-y divide-gray-100 text-sm text-gray-800">
                                <li>
                                  <Link href="/cuenta/seguimiento" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                                    <Truck size={16} className="text-saprix-electric-blue" /> Rastrear tu pedido
                                  </Link>
                                </li>
                                <li>
                                  <Link href="/cuenta/pedidos" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                                    <Package size={16} className="text-saprix-electric-blue" /> Mis pedidos
                                  </Link>
                                </li>
                                <li>
                                  <Link href="/cuenta/perfil" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                                    <UserCircle size={16} className="text-saprix-electric-blue" /> Mi perfil
                                  </Link>
                                </li>
                                <li>
                                  <Link href="/ayuda" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                                    <HelpCircle size={16} className="text-saprix-electric-blue" /> Ayuda y Preguntas frecuentes
                                  </Link>
                                </li>
                              </ul>
                            </motion.div>
                          </Popover.Panel>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </Popover>
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
                    className="flex shrink-0 items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-md hover:shadow-lg md:px-4 md:text-base"
                  >
                    <List size={18} className="text-saprix-red-orange" />
                    <span>Categorías de productos</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} className="text-saprix-red-orange" />
                    </motion.span>
                  </Popover.Button>
                  <AnimatePresence>
                    {open && (
                      <Popover.Panel
                        static
                        className="absolute left-0 z-50 mt-3 w-[860px] overflow-hidden rounded-lg bg-white text-gray-900 shadow-xl"
                      >
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {categories.map(({ name, Icon, href, color }) => (
                            <Link key={name} href={href} className="block">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-md hover:shadow-lg"
                              >
                                <Icon className="h-6 w-6" color={color} />
                                <span className="text-sm font-semibold text-gray-900">{name}</span>
                              </motion.div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                          <Link href="/tienda/categorias" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-saprix-red-orange hover:bg-saprix-red-orange/10">
                            <FaMinusCircle className="h-4 w-4 text-saprix-red-orange" />
                            <span>Ver más…</span>
                          </Link>
                        </div>
                        </motion.div>
                      </Popover.Panel>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>

            {/* Separador vertical sobre azul */}
            <span className="hidden lg:block h-6 w-px bg-white/40" />

            {/* Navegación simple en barra azul (sin megamenús) */}
            <nav className="hidden items-center gap-4 font-semibold lg:flex">
              {[
                { name: "Inicio", href: "/" },
                { name: "Tienda", href: "/tienda" },
                { name: "Blog", href: "/blog" },
                { name: "Páginas", href: "/pages" },
                { name: "Contacto", href: "/contacto" },
              ].map((item, idx, arr) => (
                <div key={item.name} className="flex items-center">
                  <Link href={item.href} className="text-white font-semibold hover:text-saprix-red-orange">
                    {item.name}
                  </Link>
                  {idx < arr.length - 1 && (<span className="mx-3 text-white/60">|</span>)}
                </div>
              ))}
            </nav>

            {/* Iconos derecha: ofertas, favoritos y carrito sobre fondo azul + Hamburger mobile */}
            <div className="flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/deals" className="flex items-center gap-2 font-bold text-white hover:text-saprix-red-orange active:text-saprix-red-orange">
                  <Flame size={18} className="text-saprix-red-orange" />
                  <span>Ofertas</span>
                </Link>
              </motion.div>
              {/* Se elimina el icono de Usuario del nivel azul */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/wishlist" className="relative text-white hover:text-saprix-red-orange" aria-label="Favoritos">
                  <IoHeartOutline className="h-6 w-6" />
                  <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f42121] text-xs text-white">{String(wishlistCount).padStart(2, "0")}</span>
                </Link>
              </motion.div>
              {/* Carrito: Sheet al click */}
              <Sheet>
                <SheetTrigger asChild>
                  <motion.button className="relative text-white hover:text-saprix-red-orange" aria-label="Carrito" whileHover={{ scale: 1.05 }}>
                    <ShoppingCart size={18} />
                    <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f42121] text-xs text-white">{String(cartCount).padStart(2, "0")}</span>
                  </motion.button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96 p-0">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="text-base font-semibold">Mi carrito</h3>
                    <button className="rounded-md p-1 hover:bg-neutral-100" aria-label="Cerrar">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3">
                    {(() => {
                      let items: Array<{ slug: string; nombre: string; imagen: string; precio: number }> = [];
                      try {
                        const raw = localStorage.getItem("cartItems") || "[]";
                        items = JSON.parse(raw);
                      } catch {}
                      if (!items || items.length === 0) {
                        items = [
                          { slug: "ejemplo-1", nombre: "Producto de ejemplo", imagen: "/placeholder-image.png", precio: 94000 },
                        ];
                      }
                      return items.map((it) => (
                        <div key={`c-${it.slug}`} className="flex items-center gap-3">
                          <img src={it.imagen} alt={it.nombre} className="h-12 w-12 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{it.nombre}</p>
                            <p className="text-xs text-gray-500">{moneyFmt.format(Number(it.precio))}</p>
                          </div>
                          <button className="rounded-md p-1 text-gray-600 hover:bg-neutral-100" aria-label="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="sticky bottom-0 border-t bg-white p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold">{moneyFmt.format(94000)}</span>
                    </div>
                    <Link href="/carrito" className="w-full rounded-md border border-saprix-electric-blue px-3 py-2 text-center text-sm font-semibold text-saprix-electric-blue hover:bg-saprix-electric-blue/10">Ver carrito</Link>
                  </div>
                </SheetContent>
              </Sheet>
              {/* Trigger del menú mobile: Sheet (shadcn/ui) */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button aria-label="Abrir menú" className="rounded-md p-2 text-white hover:bg-white/10">
                      <IoMenuOutline className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 sm:w-96">
                    <SheetHeader>
                      <SheetTitle>Menú</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-6">
                      {/* CTA principal del Sheet */}
                      <button className="w-full rounded-md bg-[#f42121] px-4 py-3 text-sm font-semibold text-white">Ingresar o Registrarse</button>
                      {/* Lista de links de cuenta con íconos */}
                      <nav className="space-y-2">
                        <Link href="/cuenta/seguimiento" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <Truck size={18} className="text-gray-600" />
                          <span className="text-sm">Rastrear tu pedido</span>
                        </Link>
                        <Link href="/cuenta/pedidos" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <Package size={18} className="text-gray-600" />
                          <span className="text-sm">Mis pedidos</span>
                        </Link>
                        <Link href="/cuenta/perfil" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <User size={18} className="text-gray-600" />
                          <span className="text-sm">Mi perfil</span>
                        </Link>
                        <Link href="/ayuda" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <HelpCircle size={18} className="text-gray-600" />
                          <span className="text-sm">Ayuda y Preguntas frecuentes</span>
                        </Link>
                      </nav>
                      {/* Categorías (vertical) */}
                      <div>
                        <h4 className="mb-2 text-sm font-bold">Categorías</h4>
                        <div className="space-y-2">
                          {categories.slice(0, 4).map(({ name, Icon, href, color }) => (
                            <Link key={`mc-${name}`} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                              <Icon className="h-5 w-5" color={color} />
                              <span className="text-sm font-semibold">{name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* User icons */}
                      <div className="flex items-center gap-6">
                        <Link href="/wishlist" className="relative" aria-label="Favoritos">
                          <IoHeartOutline className="h-6 w-6" />
                          <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saprix-red-orange text-xs text-white">{String(wishlistCount).padStart(2, "0")}</span>
                        </Link>
                        <Link href="/carrito" className="relative" aria-label="Carrito">
                          <ShoppingCart size={18} />
                          <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saprix-red-orange text-xs text-white">{String(cartCount).padStart(2, "0")}</span>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú Mobile: ahora gestionado por Sheet (shadcn/ui) con side="right" */}
    </header>
  );
}