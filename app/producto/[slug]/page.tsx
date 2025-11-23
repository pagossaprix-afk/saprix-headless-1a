import { applyMapping } from "@/lib/mapping";
import { getProductBySlug, getProductVariations, getColorOptionsFromVariations, getSizeOptionsFromVariations } from "@/lib/woocommerce";
import { productSingleMapping } from "@/config/mappings/product-single";
import ProductPageFigma from "@/components/product/ProductPageFigma";

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
      <ProductPageFigma
        mapped={mapped}
        images={Array.isArray(product.images) ? product.images : []}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        variations={variations}
        slug={slug}
      />
    </main>
  );
}
