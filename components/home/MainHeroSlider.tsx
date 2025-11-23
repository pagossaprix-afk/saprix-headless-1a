"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const banners = [
    { id: 1, src: "/banners/1.png", alt: "Saprix Colección 2025", title: "Nueva Colección 2025", subtitle: "Domina la cancha", link: "/tienda?new=true" },
    { id: 2, src: "/banners/2.png", alt: "Zapatillas Profesionales", title: "Rendimiento Superior", subtitle: "Tecnología de punta", link: "/tienda" },
    { id: 3, src: "/banners/3.png", alt: "Estilo y Confort", title: "Estilo Único", subtitle: "Diseñadas para ganar", link: "/tienda" },
    { id: 4, src: "/banners/4.png", alt: "Fútbol Sala", title: "Pasión por el Futsal", subtitle: "La marca de los campeones", link: "/tienda" },
    { id: 5, src: "/banners/5.png", alt: "Edición Limitada", title: "Edición Limitada", subtitle: "Exclusividad total", link: "/tienda?featured=true" },
    { id: 6, src: "/banners/6.png", alt: "Ofertas Especiales", title: "Ofertas de Temporada", subtitle: "Precios increíbles", link: "/ofertas" },
];

export default function MainHeroSlider() {
    return (
        <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[85vh] overflow-hidden bg-gray-900">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                loop={true}
                className="w-full h-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative w-full h-full">
                        {/* Imagen de fondo */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={banner.src}
                                alt={banner.alt}
                                fill
                                priority={banner.id === 1}
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                            {/* Overlay degradado para mejorar legibilidad */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* Contenido (Texto) */}
                        <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl space-y-6">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-lg"
                                >
                                    {banner.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="text-lg sm:text-2xl text-gray-200 font-medium drop-shadow-md"
                                >
                                    {banner.subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <Link
                                        href={banner.link}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-saprix-electric-blue/50"
                                    >
                                        Ver Colección
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Estilos personalizados para Swiper dots y arrows */}
            <style jsx global>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #2500ff; /* Saprix Electric Blue */
          opacity: 1;
          transform: scale(1.2);
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }
      `}</style>
        </section>
    );
}
