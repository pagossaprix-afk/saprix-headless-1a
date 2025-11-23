"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { MouseEvent } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
}

export default function ProductCard({ id, name, price, imageUrl, slug }: ProductCardProps) {
  const { addItem } = useCart();
  // Imagen 'placeholder' por si un guayo no tiene foto
  const finalImageUrl = imageUrl || '/placeholder-image.png';

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    // Parse price string to number (remove non-numeric chars except dot)
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

    addItem({
      id,
      name,
      price: numericPrice,
      quantity: 1,
      image: finalImageUrl,
      slug
    });
  };

  return (
    <Link href={`/producto/${slug}`} className="group block relative">
      <div className="overflow-hidden bg-saprix-indigo rounded-lg border-2 border-saprix-indigo transition-all duration-300 hover:border-saprix-electric-blue">
        {/* Contenedor de la Imagen */}
        <div className="relative w-full aspect-square">
          <Image
            src={finalImageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-2 bg-lime-400 text-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-lime-300 transform translate-y-2 group-hover:translate-y-0"
            title="Agregar al carrito"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="mt-3 px-1">
        <h3 className="text-sm font-semibold text-saprix-white truncate group-hover:text-saprix-electric-blue">
          {name}
        </h3>
        <p className="mt-1 text-base font-bold text-saprix-white">
          ${price}
        </p>
      </div>
    </Link>
  );
}