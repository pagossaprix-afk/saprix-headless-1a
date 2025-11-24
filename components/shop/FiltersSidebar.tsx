"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export type Category = { id: number; name: string; slug: string; count?: number };
export type Tag = { id: number; name: string; slug: string; count?: number };
export type AttributeTerm = { id: number; name: string; slug: string; count?: number };
export type AttributeWithTerms = { attribute: { id: number; name: string; slug: string }; terms: AttributeTerm[] };

interface FiltersSidebarProps {
  categories: Category[];
  tags: Tag[];
  attributes: AttributeWithTerms[];
  selected: {
    category?: string[];
    tag?: string[];
    attr_linea?: string[];
    attr_audiencia?: string[];
    price_min?: number;
    price_max?: number;
  };
  currentParams: Record<string, string>;
}

export function FiltersSidebar({
  categories,
  tags,
  attributes,
  selected,
  currentParams,
}: FiltersSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    tags: false,
    linea: false,
    audiencia: false,
  });

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function makeHref(next: Record<string, string | undefined>) {
    // Filtrar solo valores string de currentParams
    const stringParams: Record<string, string> = {};
    Object.entries(currentParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        stringParams[key] = value;
      }
    });

    const params = new URLSearchParams(stringParams);
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
    <aside className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtros</h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Categorías */}
        <div>
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categorías</h3>
            {openSections.categories ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {openSections.categories && (
            <div className="px-4 pb-4 space-y-2">
              {categories.map((c) => {
                const active = selectedCategory === c.slug;
                const href = makeHref({ category: active ? undefined : c.slug });
                return (
                  <Link
                    key={c.id}
                    href={href}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${active
                        ? "bg-saprix-electric-blue text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <span>{c.name}</span>
                    {typeof c.count === "number" && (
                      <span className="text-xs opacity-70">({c.count})</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection("tags")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Etiquetas</h3>
              {openSections.tags ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {openSections.tags && (
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {tags.map((t) => {
                  const active = selectedTag === t.slug;
                  const href = makeHref({ tag: active ? undefined : t.slug });
                  return (
                    <Link
                      key={t.id}
                      href={href}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${active
                          ? "bg-saprix-electric-blue text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                      {t.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Línea Saprix */}
        {lineaAttr && (
          <div>
            <button
              onClick={() => toggleSection("linea")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Línea Saprix</h3>
              {openSections.linea ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {openSections.linea && (
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {lineaAttr.terms.map((term) => {
                  const href = makeHref({ attr_linea: term.slug });
                  return (
                    <Link
                      key={term.id}
                      href={href}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {term.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Audiencia */}
        {audienciaAttr && (
          <div>
            <button
              onClick={() => toggleSection("audiencia")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Audiencia</h3>
              {openSections.audiencia ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {openSections.audiencia && (
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {audienciaAttr.terms.map((term) => {
                  const href = makeHref({ attr_audiencia: term.slug });
                  return (
                    <Link
                      key={term.id}
                      href={href}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {term.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}