import { applyMapping } from "@/lib/mapping";
import { getProductBySlug, getProductVariations, getColorOptionsFromVariations, getSizeOptionsFromVariations } from "@/lib/woocommerce";
import { productSingleMapping } from "@/config/mappings/product-single";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>
};

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return (
      <main className="container mx-auto px-4 py-10 text-red-500">No se encontró el producto: {slug}</main>
    );
  }
  const variations = await getProductVariations(product.id);
  const colorOptions = await getColorOptionsFromVariations(product.id);
  const sizeOptions = await getSizeOptionsFromVariations(product.id);
  const mapped = applyMapping(product, productSingleMapping);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={mapped.image || "/placeholder-image.png"}
            alt={mapped.name || "Producto"}
            className="w-full h-auto rounded border border-saprix-indigo bg-dark-performance-800"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-saprix-white">{mapped.name}</h1>
          <p className="text-gray-400">Slug: {mapped.slug}</p>
          <p className="text-gray-400">Tipo: {mapped.type}</p>
          <div className="mt-4">
            <span className="text-saprix-white text-xl font-semibold">{mapped.final_price ?? mapped.price ?? "—"}</span>
            {mapped.regular_price && mapped.sale_price && (
              <span className="ml-2 text-sm text-gray-500 line-through">{mapped.regular_price}</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">Stock: {mapped.stock_status ?? "unknown"}</div>
          {mapped.short_description && (
            <div className="mt-4 text-gray-300" dangerouslySetInnerHTML={{ __html: mapped.short_description }} />
          )}
          {mapped.description && (
            <div className="mt-6">
              <h3 className="text-saprix-white font-semibold mb-2">Descripción</h3>
              <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: mapped.description }} />
            </div>
          )}
          {Array.isArray(mapped.tags) && mapped.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-saprix-white font-semibold mb-2">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {mapped.tags.map((t: string) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-dark-performance-800 border border-saprix-indigo text-saprix-white">{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <button className="px-5 py-2 rounded bg-saprix-electric-blue text-dark-performance-900 font-bold">¡Domina la Cancha!</button>
          </div>
          <div className="mt-3 text-xs text-gray-500">Variaciones encontradas: {variations.length}</div>
          {colorOptions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-saprix-white font-semibold">Colores disponibles</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {colorOptions.map((c) => (
                  <div key={c.option} className="flex items-center gap-2 px-3 py-2 rounded border border-saprix-indigo bg-dark-performance-800">
                    {c.image && (
                      <img src={c.image} alt={c.option} className="w-8 h-8 rounded object-cover" />
                    )}
                    <span className="text-sm text-saprix-white">{c.option}</span>
                    <span className="text-[10px] text-gray-400">({c.variations.length} variaciones)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sizeOptions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-saprix-white font-semibold">Tallas disponibles</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {sizeOptions.map((s) => (
                  <div key={s.option} className="flex items-center gap-2 px-3 py-2 rounded border border-saprix-indigo bg-dark-performance-800">
                    <span className="text-sm text-saprix-white">{s.option}</span>
                    <span className="text-[10px] text-gray-400">({s.variations.length} variaciones)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-saprix-white font-semibold mb-2">Debug (mapeo aplicado)</h2>
        <pre className="text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-72">{JSON.stringify(mapped, null, 2)}</pre>
      </div>
      <div className="mt-6">
        <h2 className="text-saprix-white font-semibold mb-2">Debug (colores desde variaciones)</h2>
        <pre className="text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-72">{JSON.stringify(colorOptions, null, 2)}</pre>
      </div>
      <div className="mt-6">
        <h2 className="text-saprix-white font-semibold mb-2">Debug (tallas desde variaciones)</h2>
        <pre className="text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-72">{JSON.stringify(sizeOptions, null, 2)}</pre>
      </div>
    </main>
  );
}