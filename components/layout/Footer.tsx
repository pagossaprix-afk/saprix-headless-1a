'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function DixorFooter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Section - Logo & Locations */}
          <div className="space-y-8">
            {/* Logo */}
            <div>
              <Link href="/" className="inline-block">
                <span className="text-3xl font-bold text-white">Saprix</span>
              </Link>
            </div>

            {/* Locations */}
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Colombia */}
              <div>
                <h3 className="text-white font-semibold mb-3">Colombia</h3>
                <address className="not-italic text-sm text-gray-400 leading-relaxed">
                  Calle 100 #19-61, Piso 5<br />
                  Bogotá, Colombia
                </address>
              </div>

              {/* México */}
              <div>
                <h3 className="text-white font-semibold mb-3">México</h3>
                <address className="not-italic text-sm text-gray-400 leading-relaxed">
                  Av. Insurgentes Sur 1602<br />
                  CDMX, México
                </address>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <a
                href="mailto:info@saprix.com"
                className="block text-white hover:text-lime-400 transition-colors text-lg"
              >
                info@saprix.com
              </a>
              <a
                href="tel:+573001234567"
                className="block text-lime-400 hover:text-lime-300 transition-colors text-lg font-semibold"
              >
                +57 300 123 4567
              </a>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-saprix-electric-blue dark:hover:bg-saprix-electric-blue flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-saprix-electric-blue dark:hover:bg-saprix-electric-blue flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-saprix-electric-blue dark:hover:bg-saprix-electric-blue flex items-center justify-center transition-colors group"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Section - Links & Newsletter */}
          <div className="space-y-8">
            {/* Links Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              {/* Company */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Empresa</h4>
                <div className="space-y-2">
                  <Link href="/nosotros" className="block text-sm hover:text-white transition-colors">
                    Sobre Nosotros
                  </Link>
                  <Link href="/contacto" className="block text-sm hover:text-white transition-colors">
                    Contacto
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Soporte</h4>
                <div className="space-y-2">
                  <Link href="/preguntas-frecuentes" className="block text-sm hover:text-white transition-colors">
                    Preguntas Frecuentes
                  </Link>
                  <Link href="/envios" className="block text-sm hover:text-white transition-colors">
                    Envíos
                  </Link>
                  <Link href="/devoluciones" className="block text-sm hover:text-white transition-colors">
                    Devoluciones
                  </Link>
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
                <div className="space-y-2">
                  <Link href="/terminos-y-condiciones" className="block text-sm hover:text-white transition-colors">
                    Términos y Condiciones
                  </Link>
                  <Link href="/politica-de-privacidad" className="block text-sm hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full px-6 py-4 bg-gray-800 dark:bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-lime-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-lime-400 transition-colors"
                  aria-label="Suscribirse"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Copyright © {new Date().getFullYear()} Saprix. Todos los derechos reservados
          </p>

          {/* Theme Toggle & Scroll to Top */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-saprix-lime dark:hover:bg-saprix-lime dark:hover:text-black flex items-center justify-center transition-colors shadow-lg"
              aria-label="Volver arriba"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
