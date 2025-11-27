"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Ruler } from "lucide-react";
import SizeGuide from "./SizeGuide";
import GoogleReviews from "./GoogleReviews";
import { buttonStyles, cardStyles, layout } from "@/lib/design-system";
import { useCart } from "@/context/CartContext";
import { ensureHttps } from "@/lib/utils";

type Media = { src: string; alt?: string };
type ColorOption = { option: string; variations: number[]; image?: string };
type SizeOption = { option: string; variations: number[] };

type Props = {
  mapped: any;
  images: Media[];
  colorOptions: ColorOption[];
  sizeOptions: SizeOption[];
  variations: any[];
  slug: string;
};

export default function ProductPageFigma({ mapped, images, colorOptions, sizeOptions, variations, slug }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions?.[0]?.option ?? "");
  const [selectedSize, setSelectedSize] = useState<string>(sizeOptions?.[0]?.option ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const selectedVariantId = useMemo(() => {
    const c = colorOptions.find((x) => x.option === selectedColor)?.variations ?? [];
    const s = sizeOptions.find((x) => x.option === selectedSize)?.variations ?? [];
    const inter = c.filter((id) => s.includes(id));
    return inter[0];
  }, [selectedColor, selectedSize, colorOptions, sizeOptions]);

  const sizeAvailability = useMemo(() => {
    return sizeOptions.map((s) => {
      const cvars = colorOptions.find((x) => x.option === selectedColor)?.variations ?? [];
      const inter = cvars.filter((id) => s.variations.includes(id));
      return { option: s.option, available: inter.length > 0 };
    });
  }, [selectedColor, colorOptions, sizeOptions]);

  // Selected variation and stock information
  const selectedVariation = useMemo(
    () => variations.find((v) => v.id === selectedVariantId),
    [selectedVariantId, variations]
  );

  const variationStock =
    selectedVariation?.stock_quantity ??
    (selectedVariation?.stock_status === "outofstock" ? 0 : undefined);

  const isOutOfStock =
    variationStock === 0 || selectedVariation?.stock_status === "outofstock";

  const mainImages: Media[] = images && images.length > 0
    ? images.map(img => ({ ...img, src: ensureHttps(img.src) }))
    : [{ src: ensureHttps(mapped?.image) ?? "/placeholder-image.png" }];

  const priceFmt = useMemo(() => {
    const locale = "es-CO";
    const currency = "COP";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
      });
    } catch {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
    }
  }, []);

  const { addItem } = useCart();

  function addToCart() {
    const imagen = ensureHttps(mainImages?.[0]?.src) || "/placeholder-image.png";
    const nombre = mapped?.name || slug;
    const precio = Number(mapped?.final_price || mapped?.price || 0);

    addItem({
      id: mapped?.id || 0, // Ensure we have an ID. If mapped doesn't have it, we might have an issue.
      name: nombre,
      price: precio,
      quantity: quantity,
      image: imagen,
      slug: slug,
      variationId: selectedVariantId,
      attributes: {
        Color: selectedColor,
        Talla: selectedSize
      }
    });
  }

  function toggleWishlist() {
    try {
      const curr = parseInt(localStorage.getItem("wishlistCount") || "0");
      const next = isWishlisted ? Math.max(0, curr - 1) : curr + 1;
      localStorage.setItem("wishlistCount", String(next));
      setIsWishlisted((v) => !v);
    } catch {
      setIsWishlisted((v) => !v);
    }
  }


  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews'>('description');

  // Mock data for reviews
  // Mock data for reviews removed in favor of GoogleReviews component

  // Mock data for features if not present in mapped
  const features = mapped?.attributes || [
    { name: "Material Exterior", options: ["Sintético de alta resistencia"] },
    { name: "Suela", options: ["Caucho antideslizante", "Non-marking"] },
    { name: "Forro", options: ["Textil transpirable"] },
    { name: "Uso recomendado", options: ["Fútbol Sala", "Sintética"] },
    { name: "Garantía", options: ["6 meses por defectos de fábrica"] },
  ];

  return (
    <div className="min-h-screen bg-saprix-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm text-saprix-gray-600 mb-8 font-inter">
          <span>Inicio</span>
          <span>/</span>
          <span>{mapped?.type === "variable" ? "Variaciones" : "Producto"}</span>
          <span>/</span>
          <span className="text-saprix-electric-blue font-medium">{mapped?.name ?? slug}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Thumbnails - Vertical on the left (2 columns) */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
                  {mainImages.map((image, index) => (
                    <button
                      key={`${image.src}-${index}`}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${selectedImage === index ? "border-saprix-electric-blue" : "border-saprix-gray-200 hover:border-saprix-gray-300"
                        }`}
                    >
                      <Image src={image.src} alt={image.alt || mapped?.name || slug} width={120} height={120} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Image */}
              <div className="lg:col-span-9 order-1 lg:order-2">
                <div className="relative w-full aspect-square bg-white border-2 border-saprix-gray-200 overflow-hidden group cursor-zoom-in z-10">
                  <Image
                    src={mainImages[selectedImage].src}
                    alt={mapped?.name || "Producto Saprix"}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.75]"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="border-b border-saprix-gray-200">
                <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-4 px-2 font-inter font-semibold transition-colors whitespace-nowrap ${activeTab === 'description' ? 'border-b-2 border-saprix-electric-blue text-saprix-electric-blue' : 'text-saprix-gray-600 hover:text-saprix-gray-900'}`}
                  >
                    Descripción
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`py-4 px-2 font-inter font-semibold transition-colors whitespace-nowrap ${activeTab === 'features' ? 'border-b-2 border-saprix-electric-blue text-saprix-electric-blue' : 'text-saprix-gray-600 hover:text-saprix-gray-900'}`}
                  >
                    Características
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-2 font-inter font-semibold transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-2 border-saprix-electric-blue text-saprix-electric-blue' : 'text-saprix-gray-600 hover:text-saprix-gray-900'}`}
                  >
                    Reseñas
                  </button>
                </div>
              </div>
              <div className="py-8">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    {mapped?.description ? (
                      <div className="text-saprix-gray-700 font-inter leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: mapped.description }} />
                    ) : (
                      <p className="text-saprix-gray-700 font-inter leading-relaxed text-lg">No hay descripción disponible.</p>
                    )}
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 gap-4">
                    {features.map((feature: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 border border-saprix-gray-200">
                        <h4 className="font-semibold text-saprix-gray-900 mb-2">{feature.name}</h4>
                        <ul className="list-disc list-inside text-saprix-gray-600">
                          {feature.options?.map((opt: string, i: number) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <GoogleReviews />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-saprix-success/10 text-saprix-success text-sm font-inter font-semibold -skew-x-6">Disponible</span>
                <span className="px-3 py-1 bg-saprix-electric-blue/10 text-saprix-electric-blue text-sm font-inter font-semibold -skew-x-6">NUEVO</span>
              </div>
              <h1 className="text-4xl font-inter font-bold text-saprix-gray-900 mb-4">{mapped?.name ?? slug}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-saprix-gray-300"}`} />
                  ))}
                </div>
                <span className="text-saprix-gray-600 font-inter">4.8 (127 reseñas)</span>
              </div>

              {mapped?.short_description ? (
                <div
                  className="text-xl text-saprix-gray-600 font-inter leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mapped.short_description }}
                />
              ) : null}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-inter font-bold text-saprix-gray-900">{priceFmt.format(Number(mapped?.final_price || mapped?.price || 0))}</span>
              {mapped?.regular_price && mapped?.sale_price && (
                <span className="text-2xl font-inter text-saprix-gray-500 line-through">{priceFmt.format(Number(mapped?.regular_price || 0))}</span>
              )}
              {mapped?.sale_price && (
                <span className="px-3 py-1 bg-saprix-red-orange text-white text-sm font-inter font-bold -skew-x-6">OFERTA</span>
              )}
            </div>

            {colorOptions && colorOptions.length > 0 && (
              <div>
                <h3 className="text-lg font-inter font-semibold text-saprix-gray-900 mb-4">Color: <span className="text-saprix-gray-600 font-normal">{selectedColor}</span></h3>
                <div className="flex space-x-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.option}
                      onClick={() => {
                        setSelectedColor(color.option);
                        if (color.image) {
                          const idx = mainImages.findIndex(img => img.src === color.image);
                          if (idx !== -1) setSelectedImage(idx);
                        }
                      }}
                      className={`w-10 h-10 border-2 transition-all duration-200 -skew-x-6 ${selectedColor === color.option ? "border-saprix-gray-900 scale-110" : "border-saprix-gray-300 hover:border-saprix-gray-500"} cursor-pointer hover:scale-105`}
                      style={{ backgroundColor: "transparent", backgroundImage: color.image ? `url(${color.image})` : undefined, backgroundSize: color.image ? "cover" : undefined }}
                      aria-label={`Color ${color.option}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizeOptions && sizeOptions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-inter font-semibold text-saprix-gray-900">Talla: <span className="text-saprix-gray-600 font-normal">EU {selectedSize}</span></h3>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-sm text-saprix-electric-blue font-medium flex items-center gap-1 hover:underline"
                  >
                    <Ruler className="w-4 h-4" /> Guía de Tallas
                  </button>
                </div>
                <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar mask-gradient-right">
                  {sizeAvailability.map((sz) => (
                    <button
                      key={sz.option}
                      onClick={() => setSelectedSize(sz.option)}
                      disabled={!sz.available}
                      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm border font-inter font-semibold transition-all duration-200 -skew-x-6 ${selectedSize === sz.option ? "border-saprix-electric-blue bg-saprix-electric-blue text-white" : sz.available ? "border-saprix-gray-300 text-saprix-gray-700 hover:border-saprix-electric-blue hover:text-saprix-electric-blue" : "border-saprix-gray-200 text-saprix-gray-400 cursor-not-allowed line-through"}`}
                    >
                      <span className="block skew-x-6">{sz.option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Stock */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-inter font-semibold text-saprix-gray-900">
                  Cantidad:
                </span>
                <div className="flex items-center border-2 border-saprix-gray-300 -skew-x-6">
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.max(1, Math.min(prev - 1, variationStock ?? 1))
                      )
                    }
                    className="p-3 hover:bg-saprix-gray-100 transition-colors duration-200"
                  >
                    <Minus className="w-5 h-5 skew-x-6" />
                  </button>
                  <span className="px-6 py-3 font-inter font-semibold text-lg min-w-[60px] text-center skew-x-6">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(prev + 1, variationStock ?? 9999)
                      )
                    }
                    className="p-3 hover:bg-saprix-gray-100 transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5 skew-x-6" />
                  </button>
                </div>
              </div>

              {/* Stock indicator */}
              <div>
                {isOutOfStock ? (
                  <span className="text-sm font-medium text-red-600">
                    Agotado
                  </span>
                ) : (
                  <span className="text-sm font-medium text-green-600">
                    {variationStock && variationStock > 0
                      ? `Quedan ${variationStock} unidades`
                      : "En stock"}
                  </span>
                )}
              </div>

              {/* Add to Cart + Wishlist */}
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 bg-saprix-electric-blue hover:bg-saprix-electric-blue-dark text-white py-4 px-6 font-inter font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 -skew-x-6 ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <div className="flex items-center space-x-2 skew-x-6">
                    <ShoppingCart className="w-6 h-6" />
                    <span>Añadir al Carrito</span>
                  </div>
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-16 h-16 border-2 flex items-center justify-center transition-all duration-200 -skew-x-6 ${isWishlisted
                    ? "border-saprix-red-orange bg-saprix-red-orange text-white"
                    : "border-saprix-gray-300 text-saprix-gray-600 hover:border-saprix-red-orange hover:text-saprix-red-orange"
                    }`}
                >
                  <Heart
                    className={`w-6 h-6 skew-x-6 ${isWishlisted ? "fill-current" : ""
                      }`}
                  />
                </button>
              </div>
            </div>

<<<<<<< HEAD
  {/* Warranty and Returns */ }
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-saprix-electric-blue/10 flex items-center justify-center -skew-x-6"><Shield className="w-6 h-6 text-saprix-electric-blue skew-x-6" /></div>
      <div><p className="font-inter font-semibold text-saprix-gray-900">Garantía Saprix</p><p className="text-sm text-saprix-gray-600">6 meses de garantía oficial</p></div>
=======
            <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-saprix-electric-blue/10 flex items-center justify-center -skew-x-6 flex-shrink-0"><Truck className="w-4 h-4 text-saprix-electric-blue skew-x-6" /></div>
          <div><p className="font-inter font-semibold text-saprix-gray-900 text-xs leading-tight">Envío Gratis</p><p className="text-[10px] text-saprix-gray-600 leading-tight">En compras +$150k</p></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-saprix-electric-blue/10 flex items-center justify-center -skew-x-6 flex-shrink-0"><Shield className="w-4 h-4 text-saprix-electric-blue skew-x-6" /></div>
          <div><p className="font-inter font-semibold text-saprix-gray-900 text-xs leading-tight">Garantía Saprix</p><p className="text-[10px] text-saprix-gray-600 leading-tight">6 meses oficial</p></div>
>>>>>>> 9252150b5728ab95b157b548825b644de79e942b
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-saprix-electric-blue/10 flex items-center justify-center -skew-x-6 flex-shrink-0"><RotateCcw className="w-4 h-4 text-saprix-electric-blue skew-x-6" /></div>
          <div><p className="font-inter font-semibold text-saprix-gray-900 text-xs leading-tight">Devoluciones</p><p className="text-[10px] text-saprix-gray-600 leading-tight">30 días</p></div>
        </div>
      </div>
    </div>
  </div>


      </div >
    <SizeGuide
      isOpen={isSizeGuideOpen}
      onClose={() => setIsSizeGuideOpen(false)}
      productName={mapped?.name || slug}
      categories={mapped?.categories?.map((c: any) => c.name) || []}
    />
    </div >
  );
}
