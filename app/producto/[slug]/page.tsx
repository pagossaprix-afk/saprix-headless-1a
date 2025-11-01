import api from "@/lib/woocommerce";
import Image from "next/image";
import { notFound } from "next/navigation"; // Pa' mandar 404 si no existe

// 1. Definimos el tipo de 'props' que esta página recibe
type ProductPageProps = {
  params: {
    slug: string;
  };
};

// 2. Función pa' jalar el producto (Server-Side)
async function getProductBySlug(slug: string) {
  try {
    const response = await api.get("products", {
      slug: slug,
      per_page: 1, // Solo queremos uno
    });

    // Si la API no devuelve nada, el producto no existe
    if (response.data.length === 0) {
      return null;
    }

    // Devolvemos el primer (y único) producto del array
    return response.data[0];
  } catch (error) {
    console.error("ERROR BERRRACO JALANDO PRODUCTO POR SLUG:", error);
    return null; // Fallo en la conexión
  }
}

// 3. La Página (¡El Componente Async!)
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  // Si el producto es nulo (no se encontró o falló la API),
  // le tiramos un 404 Nivel Dios al cliente
  if (!product) {
    notFound();
  }

  const imageUrl = product.images?.[0]?.src || "/placeholder-image.png";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Columna Izquierda: Galería de Imágenes (Por ahora solo la principal) */}
        <div className="relative w-full aspect-square overflow-hidden rounded-lg border-2 border-saprix-indigo">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Columna Derecha: Información y Compra */}
        <div className="flex flex-col justify-center">
          {/* Nombre del Producto */}
          <h1 className="text-4xl font-semibold text-saprix-white">{product.name}</h1>

          {/* Precio del Producto */}
          <p className="mt-4 text-3xl font-bold text-saprix-electric-blue">
            ${product.price}
          </p>

          {/* Descripción (Jalada de WordPress) */}
          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-saprix-white">Descripción</h2>
              {/* ¡JUGADA MAESTRA! Usamos esto pa' renderizar el HTML
                  que viene de la descripción de WooCommerce (viñetas, negritas, etc.)
              */}
              <div
                className="prose prose-invert mt-4 text-saprix-white max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* --- AQUÍ VA EL PRÓXIMO CAMELLO --- */}
          <div className="mt-8 pt-8 border-t border-saprix-indigo">
            <h3 className="text-xl font-semibold text-saprix-electric-blue">
              ¡DOMINA LA CANCHA!
            </h3>
            <p className="mt-2 text-saprix-indigo">
              Próximo camello: Aquí van los "Swatches" (Tallas y Colores)
              y el botón de "Añadir al Carrito".
            </p>
          </div>
          {/* --- FIN DEL PRÓXIMO CAMELLO --- */}
        </div>
      </div>
    </div>
  );
}