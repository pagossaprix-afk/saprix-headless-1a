// En lib/woocommerce.ts

// ¡CRÍTICO! Esto garantiza que este código (y las llaves)
// NUNCA se ejecuten en el navegador del cliente.
import "server-only";

import API from "@woocommerce/woocommerce-rest-api";
import type { Variation } from "@/types/woocommerce";

const api = new API({
  url: process.env.WOOCOMMERCE_API_URL || "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
  version: "wc/v3", // Usamos la v3 de la API
});

export default api;

// Alias por conveniencia si el código existente usa `wcApi`
export const wcApi = api;

// Tipo mínimo para variaciones (ajústese si se requiere más campos)
// Tipado de Variation proviene de '@/types/woocommerce'

/**
 * MACHETAZO 4.5:
 * Llave para traer las "hijas" (variaciones) de un producto "papá" (variable) por ID.
 */
export async function getProductVariations(productId: number): Promise<Variation[]> {
  try {
    console.log(`[SAPRIX DEBUG] Pidiendo variaciones para ID: ${productId}`);
    const response = await api.get(`products/${productId}/variations`, {
      per_page: 100, // Traemos todas las tallas/colores
    });

    if ((response as any)?.status && (response as any)?.status !== 200) {
      throw new Error(`Error en la API: ${(response as any)?.statusText}`);
    }

    const data = (response as any)?.data ?? [];
    console.log(`\[SAPRIX DEBUG] ¡Variaciones encontradas: ${Array.isArray(data) ? data.length : 0}!`);
    return data as Variation[];
  } catch (error: any) {
    console.error("¡ERROR BERRRACO trayendo variaciones!", error?.response?.data || error?.message || error);
    return [];
  }
}

// Traer producto por slug (primer resultado)
export async function getProductBySlug(slug: string): Promise<any | null> {
  try {
    const response = await api.get("products", { slug, per_page: 1 });
    const items = (response as any)?.data ?? [];
    if (Array.isArray(items) && items.length > 0) {
      return items[0];
    }
    return null;
  } catch (error: any) {
    console.error("¡ERROR BERRRACO trayendo producto por slug!", error?.response?.data || error?.message || error);
    return null;
  }
}

// Traer el producto más reciente (fallback para la página de referencia)
export async function getLatestProduct(): Promise<any | null> {
  try {
    const response = await api.get("products", { per_page: 1, order: "desc", orderby: "date" });
    const items = (response as any)?.data ?? [];
    if (Array.isArray(items) && items.length > 0) {
      return items[0];
    }
    return null;
  } catch (error: any) {
    console.error("¡ERROR BERRRACO trayendo el producto más reciente!", error?.response?.data || error?.message || error);
    return null;
  }
}

// Helper: obtener URL de imagen de la librería de medios de WordPress por ID
async function getMediaSourceUrl(mediaId: number): Promise<string | undefined> {
  try {
    const base = process.env.WOOCOMMERCE_API_URL || "";
    if (!base) return undefined;
    const url = `${base.replace(/\/$/, "")}/wp-json/wp/v2/media/${mediaId}`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const j = await res.json();
    return j?.source_url || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extrae opciones de color directamente de las variaciones del producto.
 * Considera atributos con slug "pa_color" o nombre que contenga "color" (case-insensitive).
 */
export async function getColorOptionsFromVariations(productId: number): Promise<Array<{ option: string; variations: number[]; image?: string }>> {
  const variations = await getProductVariations(productId);
  const byColor: Record<string, { option: string; variations: number[]; image?: string }> = {};
  for (const v of variations as any[]) {
    const attrs = Array.isArray(v.attributes) ? v.attributes : [];
    const colorAttr = attrs.find((a: any) => {
      const slug = (a.slug || a.name || "").toString().toLowerCase();
      return slug.includes("color"); // matches pa_color or Color
    });
    const option = colorAttr?.option;
    if (!option) continue;
    const key = option.toString();
    if (!byColor[key]) {
      byColor[key] = { option: key, variations: [], image: v?.image?.src || undefined };
    }
    byColor[key].variations.push(v.id);
    // Preferir imagen de la variación
    if (!byColor[key].image && v?.image?.src) {
      byColor[key].image = v.image.src;
    }
    // Soporte para plugins de galería de variaciones vía meta_data (IDs de media)
    if (!byColor[key].image && Array.isArray(v?.meta_data)) {
      const meta = v.meta_data as Array<{ key: string; value: any }>;
      const galleryMeta = meta.find((m) => ["woo_variation_gallery_images", "rtwpvg_images"].includes(m.key));
      const ids: number[] = Array.isArray(galleryMeta?.value)
        ? galleryMeta!.value.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n))
        : [];
      if (ids.length > 0) {
        const src = await getMediaSourceUrl(ids[0]);
        if (src) byColor[key].image = src;
      }
    }
  }
  return Object.values(byColor);
}

/**
 * Extrae opciones de talla directamente de las variaciones del producto.
 * Detecta atributos cuyo slug/nombre contenga "talla" o "size" (incluye pa_talla / pa_tallas).
 */
export async function getSizeOptionsFromVariations(productId: number): Promise<Array<{ option: string; variations: number[] }>> {
  const variations = await getProductVariations(productId);
  const bySize: Record<string, { option: string; variations: number[] }> = {};
  for (const v of variations as any[]) {
    const attrs = Array.isArray(v.attributes) ? v.attributes : [];
    const sizeAttr = attrs.find((a: any) => {
      const slug = (a.slug || a.name || "").toString().toLowerCase();
      return slug.includes("talla") || slug.includes("size");
    });
    const option = sizeAttr?.option;
    if (!option) continue;
    const key = option.toString();
    if (!bySize[key]) {
      bySize[key] = { option: key, variations: [] };
    }
    bySize[key].variations.push(v.id);
  }
  return Object.values(bySize);
}

// -------- Catálogo global: categorías, etiquetas y atributos --------

// Helpers basados en fetch para aprovechar ISR y autenticación por query string
function buildUrl(endpoint: string, params: Record<string, any> = {}): string {
  const base = (process.env.WOOCOMMERCE_API_URL || "").replace(/\/$/, "");
  const ck = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
  const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";
  const url = new URL(`${base}/wp-json/wc/v3/${endpoint}`);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    url.searchParams.set(k, String(v));
  });
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

async function paginate<T = any>(endpoint: string, params: Record<string, any> = {}): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  const per_page = params.per_page ?? 100;
  while (true) {
    try {
      const response = await api.get(endpoint, { ...params, per_page, page });
      const data = (response as any)?.data ?? [];
      if (!Array.isArray(data) || data.length === 0) break;
      all.push(...data);
      page += 1;
      // Evitar bucles infinitos si el servidor limita duro
      if (page > 50) break;
    } catch (error: any) {
      console.error(`[Catalog paginate] Error en ${endpoint}`, error?.response?.data || error?.message || error);
      break;
    }
  }
  return all;
}

export async function getAllProductCategories(): Promise<any[]> {
  return wcFetchAll<any>("products/categories", { per_page: 100 }, 600);
}

export async function getAllProductTags(): Promise<any[]> {
  return wcFetchAll<any>("products/tags", { per_page: 100 }, 600);
}

export async function getAllProductAttributes(): Promise<any[]> {
  return wcFetchAll<any>("products/attributes", { per_page: 100 }, 600);
}

export async function getAttributeTerms(attributeId: number): Promise<any[]> {
  return wcFetchAll<any>(`products/attributes/${attributeId}/terms`, { per_page: 100 }, 600);
}

export async function getAllProductAttributesWithTerms(): Promise<Array<{ attribute: any; terms: any[] }>> {
  const attrs = await getAllProductAttributes();
  const termsList = await Promise.all((attrs || []).map((a: any) => getAttributeTerms(Number(a?.id))));
  return attrs.map((a: any, idx: number) => ({ attribute: a, terms: termsList[idx] || [] }));
}

// Helper: traer datos del sidebar (categorías, tags y atributos con términos) en paralelo
export async function getShopSidebarData(): Promise<{
  categories: any[];
  tags: any[];
  attributes: Array<{ attribute: any; terms: any[] }>;
}> {
  const [categories, tags, attributes] = await Promise.all([
    getAllProductCategories(),
    getAllProductTags(),
    getAllProductAttributesWithTerms(),
  ]);
  return { categories, tags, attributes };
}