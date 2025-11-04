import Link from "next/link";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGrid, SortValue } from "@/components/shop/ProductGrid";
import type { ProductSummary } from "@/components/shop/ProductCard";
import { getShopSidebarData } from "@/lib/woocommerce";

export const metadata = {
  title: "Tienda Saprix",
  description: "Todo para Futsal: Zapatillas, Balones y Más",
};

function buildUrl(endpoint: string, params: Record<string, any> = {}) {
  const base = (process.env.WOOCOMMERCE_API_URL || "").replace(/\/$/, "");
  const ck = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
  const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";
  const url = new URL(`${base}/wp-json/wc/v3/${endpoint}`);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    url.searchParams.set(k, String(v));
  });
  // Auth via query string (WooCommerce REST API supports this for server-side):
  url.searchParams.set("consumer_key", ck);
  url.searchParams.set("consumer_secret", cs);
  return url.toString();
}

async function wcFetchRaw<T = any>(endpoint: string, params: Record<string, any> = {}, revalidate = 600): Promise<{ data: T; headers: Headers }> {
  const url = buildUrl(endpoint, params);
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`WooCommerce fetch failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

async function wcFetchAll<T = any>(endpoint: string, params: Record<string, any> = {}, revalidate = 600): Promise<T[]> {
  const first = await wcFetchRaw<T[]>(endpoint, { ...params, page: 1 }, revalidate);
  const totalPages = parseInt(first.headers.get("x-wp-totalpages") || "1");
  const all: T[] = Array.isArray(first.data) ? [...first.data] : [];
  for (let page = 2; page <= totalPages; page++) {
    const resp = await wcFetchRaw<T[]>(endpoint, { ...params, page }, revalidate);
    if (Array.isArray(resp.data)) all.push(...resp.data);
  }
  return all;
}

function mapSort(sort: SortValue | string | undefined): { orderby: string; order: "asc" | "desc"; sort: SortValue } {
  switch (sort) {
    case "price-asc":
      return { orderby: "price", order: "asc", sort: "price-asc" };
    case "price-desc":
      return { orderby: "price", order: "desc", sort: "price-desc" };
    case "newest":
      return { orderby: "date", order: "desc", sort: "newest" };
    case "relevance":
    default:
      return { orderby: "popularity", order: "desc", sort: "relevance" };
  }
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Math.max(1, parseInt((searchParams.page as string) || "1"));
  const per_page = Math.max(1, parseInt((searchParams.per_page as string) || "12"));
  const sortParam = (searchParams.sort as string) || "relevance";
  const sort = mapSort(sortParam);
  const q = typeof searchParams.q === "string" ? (searchParams.q as string) : undefined;

  // Leer filtros por slug (simple: uno por categoría y uno por tag)
  const selectedCategorySlug = typeof searchParams.category === "string" ? (searchParams.category as string) : undefined;
  const selectedTagSlug = typeof searchParams.tag === "string" ? (searchParams.tag as string) : undefined;
  const selectedLineaSlug = typeof searchParams.attr_linea === "string" ? (searchParams.attr_linea as string) : undefined;
  const selectedAudienciaSlug = typeof searchParams.attr_audiencia === "string" ? (searchParams.attr_audiencia as string) : undefined;

  // Cargar datos de sidebar en paralelo, usando helper centralizado
  const { categories, tags, attributes } = await getShopSidebarData();

  // Convertir slugs a IDs para la API de productos (si están seleccionados)
  const categoryId = selectedCategorySlug
    ? categories.find((c: any) => c.slug === selectedCategorySlug)?.id
    : undefined;
  const tagId = selectedTagSlug ? tags.find((t: any) => t.slug === selectedTagSlug)?.id : undefined;

  // Construir parámetros de productos
  const productParams: any = {
    per_page,
    page,
    status: "publish",
    orderby: sort.orderby,
    order: sort.order,
  };
  if (categoryId) productParams.category = categoryId;
  if (tagId) productParams.tag = tagId;
  if (q && q.trim()) productParams.search = q.trim();
  // Atributos (placeholder): se requerirá confirmar taxonomías (pa_linea, pa_audiencia)
  // if (selectedLineaSlug) { productParams.attribute = "pa_linea"; productParams.attribute_term = selectedLineaSlug; }
  // if (selectedAudienciaSlug) { productParams.attribute = "pa_audiencia"; productParams.attribute_term = selectedAudienciaSlug; }

  // Fetch de productos con totales desde headers (ISR via fetch)
  let products: any[] = [];
  let total = 0;
  let totalPages = 1;
  try {
    const resp = await wcFetchRaw<any[]>("products", productParams, 600);
    products = Array.isArray(resp.data) ? resp.data : [];
    total = parseInt(resp.headers.get("x-wp-total") || "0");
    totalPages = parseInt(resp.headers.get("x-wp-totalpages") || "1");
  } catch (e: any) {
    console.error("¡ERROR BERRRACO trayendo productos!", e?.message);
  }

  const mappedProducts: ProductSummary[] = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    sale_price: p.sale_price || null,
    image_url: p.images?.[0]?.src || "/placeholder-image.png",
    is_new: false,
  }));

  const selected = {
    category: selectedCategorySlug ? [selectedCategorySlug] : [],
    tag: selectedTagSlug ? [selectedTagSlug] : [],
    attr_linea: selectedLineaSlug ? [selectedLineaSlug] : [],
    attr_audiencia: selectedAudienciaSlug ? [selectedAudienciaSlug] : [],
  };

  const currentParams: Record<string, string> = {
    sort: sort.sort,
    page: `${page}`,
    per_page: `${per_page}`,
    ...(selectedCategorySlug ? { category: selectedCategorySlug } : {}),
    ...(selectedTagSlug ? { tag: selectedTagSlug } : {}),
    ...(selectedLineaSlug ? { attr_linea: selectedLineaSlug } : {}),
    ...(selectedAudienciaSlug ? { attr_audiencia: selectedAudienciaSlug } : {}),
  };

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumbs UI + JSON-LD */}
        {(() => {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const selectedCategory = selectedCategorySlug
            ? categories.find((c: any) => c.slug === selectedCategorySlug)
            : undefined;
          const breadcrumbItems = [
            { position: 1, name: "Inicio", item: `${siteUrl}/` },
            { position: 2, name: "Tienda", item: `${siteUrl}/tienda` },
            ...(selectedCategory
              ? [
                  {
                    position: 3,
                    name: selectedCategory.name,
                    item: `${siteUrl}/tienda?category=${selectedCategory.slug}`,
                  },
                ]
              : []),
          ];
          return (
            <div className="mb-4">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 text-sm text-gray-400">
                  <li>
                    <Link href="/" className="hover:text-white">Inicio</Link>
                  </li>
                  <li aria-hidden className="opacity-60">›</li>
                  <li>
                    <Link href="/tienda" className="hover:text-white">Tienda</Link>
                  </li>
                  {selectedCategory && (
                    <>
                      <li aria-hidden className="opacity-60">›</li>
                      <li>
                        <Link
                          href={`/tienda?category=${selectedCategory.slug}`}
                          className="hover:text-white"
                        >
                          {selectedCategory.name}
                        </Link>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(
                    {
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      itemListElement: breadcrumbItems.map((item) => ({
                        "@type": "ListItem",
                        position: item.position,
                        name: item.name,
                        item: item.item,
                      })),
                    },
                    null,
                    2
                  ),
                }}
              />
            </div>
          );
        })()}

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">Tienda Saprix</h1>
          <p className="mt-2 text-lg text-gray-400">Todo para Futsal: Zapatillas, Balones y Más</p>
          {q && (
            <p className="mt-2 text-sm text-gray-300">
              Resultados de búsqueda para "{q}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:col-span-1 lg:block">
            <FiltersSidebar
              categories={categories}
              tags={tags}
              attributes={attributes}
              selected={selected}
              currentParams={currentParams}
            />
          </div>

          <div className="lg:col-span-3">
            {/* TODO: Agregar un botón en mobile para ABRIR el sidebar */}
            <ProductGrid
              products={mappedProducts}
              meta={{ total, per_page, page }}
              sort={sort.sort}
            />
            {mappedProducts.length === 0 && (
              <p className="mt-6 text-sm text-gray-400">No hay productos con estos filtros.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}