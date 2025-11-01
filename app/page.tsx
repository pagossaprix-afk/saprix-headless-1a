import api from "@/lib/woocommerce"; // Importamos nuestro conector
import ProductCard from "@/components/product/ProductCard"; // ¡Importamos el ladrillo!

// ¡OJO! Convertimos la Home en una función 'async'
export default async function Home() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    // ¡OJO! Lo cambiamos a 4 productos pa' que el grid se vea melo
    const response = await api.get("products", {
      per_page: 4,
      status: "publish", // Solo traer productos publicados
    });

    products = response.data;
  } catch (e: any) {
    console.error(
      "¡ERROR BERRRACO CONECTANDO A WOOCOMMERCE!",
      e?.response?.data || e?.message
    );
    error = "¡Ups! No pudimos conectar con la bodega. Revise las llaves, parcero.";
  }

  return (
    // ¡OJO! Modificamos el 'main' pa' que sea un contenedor
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold text-saprix-white mb-8">
        Recién Llegados a la Cancha
      </h1>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* ¡LA NUEVA CUADRÍCULA NIVEL DIOS! */}
      {!error && products.length === 0 && (
        <p className="mt-4 text-saprix-indigo">No se encontraron guayos en la bodega...</p>
      )}

      {!error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              slug={product.slug} // Asumimos que la API nos manda el slug
              // Usamos la sintaxis segura que usted mismo propuso:
              imageUrl={product.images?.[0]?.src || ""}
            />
          ))}
        </div>
      )}
    </main>
  );
}
