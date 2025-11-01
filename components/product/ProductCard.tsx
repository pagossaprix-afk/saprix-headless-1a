import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
}

export default function ProductCard({ name, price, imageUrl, slug }: ProductCardProps) {
  // Imagen 'placeholder' por si un guayo no tiene foto
  const finalImageUrl = imageUrl || '/placeholder-image.png'; // (Aún no tenemos este placeholder, pero es buena práctica)

  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="overflow-hidden bg-saprix-indigo rounded-lg border-2 border-saprix-indigo transition-all duration-300 hover:border-saprix-electric-blue">
        {/* Contenedor de la Imagen */}
        <div className="relative w-full aspect-square">
          <Image
            src={finalImageUrl}
            alt={name}
            fill // "fill" hace que llene el div contenedor
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            // ¡OJO! Si no hay imagen (finalImageUrl es /placeholder-image.png),
            // descomente la línea de abajo pa' evitar errores:
            // unoptimized={!imageUrl}
          />
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