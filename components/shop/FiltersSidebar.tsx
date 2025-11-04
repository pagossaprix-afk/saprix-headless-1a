import Link from "next/link";

export type Category = { id: number; name: string; slug: string; count?: number };
export type Tag = { id: number; name: string; slug: string; count?: number };
export type AttributeTerm = { id: number; name: string; slug: string; count?: number };
export type AttributeWithTerms = { attribute: { id: number; name: string; slug: string }; terms: AttributeTerm[] };

export function FiltersSidebar({
  categories,
  tags,
  attributes,
  selected,
  currentParams,
}: {
  categories: Category[];
  tags: Tag[];
  attributes: AttributeWithTerms[];
  selected: { category?: string[]; tag?: string[]; attr_linea?: string[]; attr_audiencia?: string[]; price_min?: number; price_max?: number };
  currentParams: Record<string, string>;
}) {
  function makeHref(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(currentParams);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    // Reset a la primera página siempre que se cambien filtros
    params.delete("page");
    return `?${params.toString()}`;
  }

  const selectedCategory = selected.category?.[0];
  const selectedTag = selected.tag?.[0];

  // Detectar atributos específicos si existen por slug
  const lineaAttr = attributes.find((a) => (a.attribute?.slug || a.attribute?.name || "").toLowerCase().includes("linea"));
  const audienciaAttr = attributes.find((a) => (a.attribute?.slug || a.attribute?.name || "").toLowerCase().includes("audiencia"));

  return (
    <aside className="rounded-lg border border-saprix-indigo/30 bg-saprix-negro-azul p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold text-white">Filtros</h2>

      {/* Categorías */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300">Categorías</h3>
        <ul className="mt-2 space-y-2">
          {categories.map((c) => {
            const active = selectedCategory === c.slug;
            const href = makeHref({ category: active ? undefined : c.slug });
            return (
              <li key={c.id}>
                <Link
                  href={href}
                  className={`flex items-center justify-between rounded px-2 py-1 text-sm ${
                    active ? "bg-saprix-electrico text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <span>{c.name}</span>
                  {typeof c.count === "number" && <span className="text-xs opacity-70">{c.count}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300">Tags</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = selectedTag === t.slug;
            const href = makeHref({ tag: active ? undefined : t.slug });
            return (
              <Link
                key={t.id}
                href={href}
                className={`rounded px-2 py-1 text-xs ${
                  active ? "bg-saprix-electrico text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Línea Saprix */}
      {lineaAttr && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300">Línea Saprix</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {lineaAttr.terms.map((term) => {
              const href = makeHref({ attr_linea: term.slug });
              return (
                <Link key={term.id} href={href} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 hover:text-white">
                  {term.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Audiencia */}
      {audienciaAttr && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300">Audiencia</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {audienciaAttr.terms.map((term) => {
              const href = makeHref({ attr_audiencia: term.slug });
              return (
                <Link key={term.id} href={href} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 hover:text-white">
                  {term.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Precio (placeholder simple) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300">Precio</h3>
        <p className="mt-2 text-xs text-gray-400">Próximamente: rango de precio con aplicación por URL.</p>
      </div>
    </aside>
  );
}