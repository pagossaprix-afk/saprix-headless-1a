export interface ProductImage {
  src: string;
  alt?: string;
}

export interface ProductAttribute {
  id?: number;
  name: string; // "Color", "Tallas" o prefijado "pa_..."
  slug?: string;
  options: string[];
  variation?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string; // 'simple' | 'variable'
  images: ProductImage[];
  attributes: ProductAttribute[];
  price_html?: string;
}

export interface VariationAttribute {
  name: string; // "Color"/"Tallas" o prefijado "pa_..."
  option: string;
}

export interface Variation {
  id: number;
  price?: string;
  image?: ProductImage | null;
  attributes: VariationAttribute[];
}