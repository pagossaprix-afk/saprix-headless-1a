import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGridNike } from "@/components/shop/ProductGridNike";
import { getShopSidebarData } from "@/lib/woocommerce";
import { getCategoryBySlug, getCategoryBreadcrumbs, getCategoryHierarchy, type CategoryNode } from "@/lib/category-utils";
import { ChevronRight } from "lucide-react";

interface CategoryPageProps {
    params: {
        categoria: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export async function generateMetadata(props: CategoryPageProps) {
    const params = await props.params;
    const category = await getCategoryBySlug(params.categoria);

    if (!category) {
        return {
            title: "Categoría no encontrada - Saprix",
        };
    }

    return {
        title: `${category.name} - Saprix`,
        description: `Descubre nuestra colección de ${category.name.toLowerCase()}`,
    };
}

export default async function CategoryPage(props: CategoryPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const category = await getCategoryBySlug(params.categoria);

    if (!category) {
        notFound();
    }

    const [sidebarData, breadcrumbs, categoryTree] = await Promise.all([
        getShopSidebarData(),
        getCategoryBreadcrumbs(params.categoria),
        getCategoryHierarchy(),
    ]);

    // Encontrar subcategorías de esta categoría
    const currentCategoryNode = findCategoryNode(categoryTree, category.id);
    const subcategories = currentCategoryNode?.children || [];

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
                        {category.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        {category.description || `Explora nuestra colección de ${category.name.toLowerCase()}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {category.count} productos disponibles
                    </p>
                </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
                <div className="bg-white dark:bg-gray-900 py-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3">
                            {subcategories.map((subcat: CategoryNode) => (
                                <Link
                                    key={subcat.id}
                                    href={`/productos/${params.categoria}/${subcat.slug}`}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-saprix-electric-blue hover:text-white rounded-full text-sm font-medium transition-all duration-300"
                                >
                                    {subcat.name}
                                    <span className="ml-2 text-xs opacity-70">({subcat.count})</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                                        category: searchParams.category ? [String(searchParams.category)] : undefined,
                                        tag: searchParams.tag ? [String(searchParams.tag)] : undefined,
                                        attr_linea: searchParams.attr_linea ? [String(searchParams.attr_linea)] : undefined,
                                        attr_audiencia: searchParams.attr_audiencia ? [String(searchParams.attr_audiencia)] : undefined,
                                        price_min: searchParams.price_min ? Number(searchParams.price_min) : undefined,
                                        price_max: searchParams.price_max ? Number(searchParams.price_max) : undefined,
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
                                    categoria: params.categoria
                                }}
                            />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}

function findCategoryNode(tree: any[], categoryId: number): any | null {
    for (const node of tree) {
        if (node.id === categoryId) return node;
        if (node.children) {
            const found = findCategoryNode(node.children, categoryId);
            if (found) return found;
        }
    }
    return null;
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
