import { NextResponse } from "next/server";
import { getWooApi } from "@/lib/woocommerce";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const per_page = Math.min(Math.max(parseInt(searchParams.get("per_page") || "6"), 1), 12);
    if (!q) {
      return NextResponse.json({ productos: [], categorias: [], paginas: [] });
    }

    const response = await getWooApi().get("products", {
      search: q,
      status: "publish",
      per_page,
      orderby: "relevance",
      order: "desc",
    });

    const items = Array.isArray((response as any).data) ? (response as any).data : [];
    const productos = items.map((p: any) => ({
      id: p.id,
      nombre: p.name,
      slug: p.slug,
      precio: p.price,
      imagen: p.images?.[0]?.src || "/placeholder-image.png",
    }));

    // Categorías (WooCommerce)
    let categorias: Array<{ nombre: string; slug: string; count: number }> = [];
    try {
      const respCats = await getWooApi().get("products/categories", { per_page: 8, search: q });
      const cats = Array.isArray((respCats as any).data) ? (respCats as any).data : [];
      categorias = cats.map((c: any) => ({ nombre: c.name, slug: c.slug, count: Number(c?.count || 0) }));
    } catch {}

    // Páginas (estáticas del sitio)
    const paginasFuente = [
      { nombre: "Inicio", href: "/" },
      { nombre: "Tienda", href: "/tienda" },
      { nombre: "Blog", href: "/blog" },
      { nombre: "Contacto", href: "/contacto" },
    ];
    const qLower = q.toLowerCase();
    const paginas = paginasFuente.filter((p) => p.nombre.toLowerCase().includes(qLower)).slice(0, 6);

    return NextResponse.json({ productos, categorias, paginas });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Fallo buscando productos", mensaje: error?.response?.data || error?.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
