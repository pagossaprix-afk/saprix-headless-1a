import Link from "next/link";
import { Suspense } from "react";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGridNike } from "@/components/shop/ProductGridNike";
import { getShopSidebarData } from "@/lib/woocommerce";
import { getCategoryHierarchy } from "@/lib/category-utils";

export const metadata = {
    title: "Productos - Saprix",
    description: "Descubre nuestra colección completa de zapatillas, balones y accesorios para futsal",
};

interface SearchParams {
    categoria?: string;
    tag?: string;
    [key: string]: string | string[] | undefined;
}

export default async function ProductosPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const [sidebarData, categoryTree] = await Promise.all([
        getShopSidebarData(),
        getCategoryHierarchy(),
    ]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Todos los Productos
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Descubre nuestra colección completa de zapatillas, balones y accesorios diseñados para elevar tu juego
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Filtros */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <Suspense fallback={<div>Cargando filtros...</div>}>
                                <FiltersSidebar
                                    categories={sidebarData.categories}
                                    tags={sidebarData.tags}
                                    attributes={sidebarData.attributes}
                                    selected={{
                                        category: searchParams.categoria ? [searchParams.categoria as string] : undefined,
                                        tag: searchParams.tag ? [searchParams.tag as string] : undefined,
                                    }}
                                    currentParams={searchParams as Record<string, string>}
                                />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGridNike searchParams={searchParams} />
                        </Suspense>
                    </main>
                </div>
            </div>

            {/* Category Showcase */}
            {categoryTree.length > 0 && (
                <section className="bg-gray-50 dark:bg-gray-800 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Explora por Categoría
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryTree.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/productos/${category.slug}`}
                                    className="group relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-saprix-electric-blue/10 to-saprix-lime/10 group-hover:from-saprix-electric-blue/20 group-hover:to-saprix-lime/20 transition-all duration-300" />
                                    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {category.count} productos
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}
