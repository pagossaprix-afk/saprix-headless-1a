import api from "@/lib/woocommerce"; // Importamos nuestro conector

// ¡OJO! Convertimos la Home en una función 'async'
export default async function Home() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    // ¡LA PRIMERA LLAMADA! Traemos 5 productos
    const response = await api.get("products", {
      per_page: 5,
    });

    products = response.data;
  } catch (e: any) {
    // Si las llaves están malas o la URL no responde, esto nos salva
    console.error(
      "¡ERROR BERRRACO CONECTANDO A WOOCOMMERCE!",
      e?.response?.data || e?.message
    );
    error = "¡Ups! No pudimos conectar con la bodega. Revise las llaves, parcero.";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-semibold text-saprix-electric-blue">
        Fase 1: "Conectar el Chuzo"
      </h1>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-8 text-left w-full max-w-lg">
        <h2 className="text-2xl font-semibold">Guayos Traídos de la Bodega (WP):</h2>

        {!error && products.length === 0 && (
          <p className="mt-4 text-saprix-indigo">
            No se encontraron guayos en la bodega... ¿será que no ha metido ninguno?
          </p>
        )}

        <ul className="mt-4 list-disc pl-5">
          {products.map((product: any) => (
            <li key={product.id} className="mt-2 text-saprix-white">
              {product.name} - (Precio: ${product.price})
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
