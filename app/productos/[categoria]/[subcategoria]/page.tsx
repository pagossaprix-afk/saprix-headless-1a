import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGridNike } from "@/components/shop/ProductGridNike";
import { getShopSidebarData } from "@/lib/woocommerce";
import { getCategoryBySlug, getCategoryBreadcrumbs } from "@/lib/category-utils";
import { ChevronRight } from "lucide-react";

interface SubcategoryPageProps {
    params: {
        categoria: string;
        subcategoria: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export async function generateMetadata(props: SubcategoryPageProps) {
    const params = await props.params;
    const subcategory = await getCategoryBySlug(params.subcategoria);

    if (!subcategory) {
        return {
            title: "Categoría no encontrada - Saprix",
        };
    }

    return {
        title: `${subcategory.name} - Saprix`,
        description: `Descubre nuestra colección de ${subcategory.name.toLowerCase()}`,
    };
}

export default async function SubcategoryPage(props: SubcategoryPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const subcategory = await getCategoryBySlug(params.subcategoria);

    if (!subcategory) {
        notFound();
    }

    const [sidebarData, breadcrumbs] = await Promise.all([
        getShopSidebarData(),
        getCategoryBreadcrumbs(params.subcategoria),
    ]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-gray-800 py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                                )}
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {crumb.name}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-saprix-electric-blue transition-colors"
                                    >
                                        {crumb.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-saprix-electric-blue/10 to-saprix-lime/10 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {subcategory.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        {subcategory.description || `Explora nuestra colección de ${subcategory.name.toLowerCase()}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {subcategory.count} productos disponibles
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
                                        category: params.subcategoria ? [params.subcategoria] : undefined,
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
                            <ProductGridNike
                                searchParams={{
                                    ...searchParams,
                                    categoria: params.subcategoria
                                }}
                            />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
