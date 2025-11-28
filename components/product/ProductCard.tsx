"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { MouseEvent } from 'react';
import { ensureHttps } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
  category?: string;
  subcategory?: string;
}

export default function ProductCard({ id, name, price, imageUrl, slug, category, subcategory }: ProductCardProps) {
  const { addItem } = useCart();
  // Imagen 'placeholder' por si un guayo no tiene foto
  const finalImageUrl = ensureHttps(imageUrl) || '/placeholder-image.png';

  // Parse price string to number (remove non-numeric chars except dot)
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    addItem({
      id,
      name,
      price: numericPrice,
      quantity: 1,
      image: finalImageUrl,
      slug
    });
  };

  // Construct hierarchical URL if categories are provided, otherwise fallback to simple slug
  const productUrl = category && subcategory
    ? `/productos/${category}/${subcategory}/${slug}`
    : `/producto/${slug}`;

  return (
    <Link href={productUrl} className="group block relative">
      <div className="overflow-hidden bg-white border-2 border-saprix-gray-200 transition-all duration-300 hover:border-saprix-electric-blue -skew-x-6">
        {/* Contenedor de la Imagen */}
        <div className="relative w-full aspect-square skew-x-6 scale-105">
          <Image
            src={finalImageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-4 bg-white skew-x-6">
          <h3 className="text-lg font-inter font-bold text-saprix-gray-900 mb-1 truncate not-italic">{name}</h3>
          <p className="text-saprix-gray-500 text-sm mb-3 font-inter capitalize">{subcategory || category || 'Fútbol Sala'}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-inter font-bold text-saprix-electric-blue">
              {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(numericPrice)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation when clicking the button
                handleAddToCart(e); // Pass the event to handleAddToCart
              }}
              className="p-2 bg-saprix-electric-blue text-white hover:bg-saprix-electric-blue-dark transition-colors duration-200 -skew-x-6"
              aria-label="Añadir al carrito"
            >
              <ShoppingCart className="w-5 h-5 skew-x-6" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}