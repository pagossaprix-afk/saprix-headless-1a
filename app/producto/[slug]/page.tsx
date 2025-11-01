import api from "@/lib/woocommerce";
import Image from 'next/image';
import { notFound } from 'next/navigation';
// ¡Importamos el nuevo componente de cliente que vamos a crear!
import ProductForm from "@/components/product/ProductForm";

// 1. Definimos el tipo de 'props' que esta página recibe
type ProductPageProps = {
  params: {
    slug: string;
  };
};

// 1. Función MEJORADA: Trae el producto Y sus variaciones
async function getProductData(slug: string) {
  try {
    // Primero traemos el producto base por su slug
    const productResponse = await api.get("products", {
      slug: slug,
      per_page: 1,
    });

    if (productResponse.data.length === 0) {
      return null; // No se encontró
    }

    const product = productResponse.data[0];
    console.log("--- DEBUG SERVIDOR (PRODUCTO BASE) ---");
    console.log("Tipo de Producto:", product.type);
    console.log("Atributos del Producto:", product.attributes);
    console.log("Atributos del Producto (JSON):", JSON.stringify(product.attributes, null, 2));
    console.log("IDs de Variaciones (Base):", product.variations);
    let variations: any[] = [];

    // ¡LA MAGIA! Si el producto es "variable" (tiene tallas/colores)
    if (product.type === 'variable' && product.variations.length > 0) {
      // Hacemos la SEGUNDA llamada pa' traer las variaciones
      const variationsResponse = await api.get(`products/${product.id}/variations`);
      variations = variationsResponse.data;
      console.log("--- DEBUG SERVIDOR (VARIACIONES) ---");
      console.log("¿Cuántas variaciones trajo la API? R:", variations.length);
      console.log("Data de la primera variación (si existe):", variations[0]);
    }

    // Devolvemos todo el paquete
    return { product, variations };

  } catch (error) {
    console.error("ERROR BERRRACO JALANDO PRODUCTO Y VARIACIONES:", error);
    return null;
  }
}

// 3. La Página (¡El Componente Async!)
export default async function ProductPage({ params }: ProductPageProps) {
  
  const data = await getProductData(params.slug);

  if (!data) {
    notFound(); // 404 Nivel Dios
  }

  const { product, variations } = data;
  const imageUrl = product.images?.[0]?.src || '/placeholder-image.png';

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
          <h1 className="text-4xl font-semibold text-saprix-white">
            {product.name}
          </h1>

          {/* ¡OJO! El precio ahora lo manejará el componente de cliente */}

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

          {/* --- ¡AQUÍ REEMPLAZAMOS EL CAMELLO! --- */}
          {/* Le pasamos el producto y las variaciones que jalamos
            al nuevo Componente de Cliente.
          */}
          <ProductForm product={product} variations={variations} />
          {/* --- FIN DEL REEMPLAZO --- */}
        </div>
      </div>
    </div>
  );
}