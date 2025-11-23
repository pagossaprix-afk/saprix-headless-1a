"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react";
import { buttonStyles, cardStyles, layout } from "@/lib/design-system";
import { useCart } from "@/context/CartContext";

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

  const mainImages: Media[] = images && images.length > 0 ? images : [{ src: mapped?.image ?? "/placeholder-image.png" }];

  const priceFmt = useMemo(() => {
    const locale = "es-CO";
    const currency = "COP";
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0 });
    } catch {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });
    }
  }, []);

  const { addItem } = useCart();

  function addToCart() {
    const imagen = mainImages?.[0]?.src || "/placeholder-image.png";
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
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={mainImages[selectedImage]?.src || "/placeholder-image.png"}
                alt={mainImages[selectedImage]?.alt || mapped?.name || slug}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {mainImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${selectedImage === index ? "border-saprix-electric-blue shadow-md" : "border-saprix-gray-200 hover:border-saprix-gray-300"
                    }`}
                >
                  <Image src={image.src} alt={image.alt || mapped?.name || slug} width={120} height={120} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-saprix-success/10 text-saprix-success text-sm font-inter font-semibold rounded-full">Disponible</span>
                <span className="px-3 py-1 bg-saprix-electric-blue/10 text-saprix-electric-blue text-sm font-inter font-semibold rounded-full">NUEVO</span>
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

              <p className="text-xl text-saprix-gray-600 font-inter leading-relaxed">{mapped?.short_description ? undefined : ""}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-inter font-bold text-saprix-gray-900">{priceFmt.format(Number(mapped?.final_price || mapped?.price || 0))}</span>
              {mapped?.regular_price && mapped?.sale_price && (
                <span className="text-2xl font-inter text-saprix-gray-500 line-through">{priceFmt.format(Number(mapped?.regular_price || 0))}</span>
              )}
              {mapped?.sale_price && (
                <span className="px-3 py-1 bg-saprix-red-orange text-white text-sm font-inter font-bold rounded-full">OFERTA</span>
              )}
            </div>

            {colorOptions && colorOptions.length > 0 && (
              <div>
                <h3 className="text-lg font-inter font-semibold text-saprix-gray-900 mb-4">Color: <span className="text-saprix-gray-600 font-normal">{selectedColor}</span></h3>
                <div className="flex space-x-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.option}
                      onClick={() => setSelectedColor(color.option)}
                      className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${selectedColor === color.option ? "border-saprix-gray-900 scale-110" : "border-saprix-gray-300 hover:border-saprix-gray-500"} cursor-pointer hover:scale-105`}
                      style={{ backgroundColor: "transparent", backgroundImage: color.image ? `url(${color.image})` : undefined, backgroundSize: color.image ? "cover" : undefined }}
                      aria-label={`Color ${color.option}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizeOptions && sizeOptions.length > 0 && (
              <div>
                <h3 className="text-lg font-inter font-semibold text-saprix-gray-900 mb-4">Talla: <span className="text-saprix-gray-600 font-normal">EU {selectedSize}</span></h3>
                <div className="grid grid-cols-7 gap-2">
                  {sizeAvailability.map((sz) => (
                    <button
                      key={sz.option}
                      onClick={() => setSelectedSize(sz.option)}
                      disabled={!sz.available}
                      className={`py-3 px-4 rounded-xl border-2 font-inter font-semibold transition-all duration-200 ${selectedSize === sz.option ? "border-saprix-electric-blue bg-saprix-electric-blue text-white" : sz.available ? "border-saprix-gray-300 text-saprix-gray-700 hover:border-saprix-electric-blue hover:text-saprix-electric-blue" : "border-saprix-gray-200 text-saprix-gray-400 cursor-not-allowed line-through"}`}
                    >
                      {sz.option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-inter font-semibold text-saprix-gray-900">Cantidad:</span>
                <div className="flex items-center border-2 border-saprix-gray-300 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-saprix-gray-100 transition-colors duration-200"><Minus className="w-5 h-5" /></button>
                  <span className="px-6 py-3 font-inter font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-saprix-gray-100 transition-colors duration-200"><Plus className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button onClick={addToCart} className="flex-1 bg-saprix-electric-blue hover:bg-saprix-electric-blue-dark text-white py-4 px-6 rounded-xl font-inter font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <ShoppingCart className="w-6 h-6" />
                  <span>Añadir al Carrito</span>
                </button>
                <button onClick={toggleWishlist} className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${isWishlisted ? "border-saprix-red-orange bg-saprix-red-orange text-white" : "border-saprix-gray-300 text-saprix-gray-600 hover:border-saprix-red-orange hover:text-saprix-red-orange"}`}>
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><Truck className="w-6 h-6 text-green-600" /></div>
                <div><p className="font-inter font-semibold text-saprix-gray-900">Envío Gratis</p><p className="text-sm text-saprix-gray-600">En compras superiores a $150k</p></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Shield className="w-6 h-6 text-blue-600" /></div>
                <div><p className="font-inter font-semibold text-saprix-gray-900">Garantía Saprix</p><p className="text-sm text-saprix-gray-600">6 meses de garantía oficial</p></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><RotateCcw className="w-6 h-6 text-purple-600" /></div>
                <div><p className="font-inter font-semibold text-saprix-gray-900">Devoluciones</p><p className="text-sm text-saprix-gray-600">30 días para devoluciones</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-saprix-gray-200">
            <div className="flex space-x-8">
              <button className="py-4 px-2 border-b-2 border-saprix-electric-blue text-saprix-electric-blue font-inter font-semibold">Descripción</button>
              <button className="py-4 px-2 text-saprix-gray-600 hover:text-saprix-gray-900 font-inter font-medium">Características</button>
              <button className="py-4 px-2 text-saprix-gray-600 hover:text-saprix-gray-900 font-inter font-medium">Reseñas</button>
            </div>
          </div>
          <div className="py-8">
            <div className="prose max-w-none">
              {mapped?.description ? (
                <div className="text-saprix-gray-700 font-inter leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: mapped.description }} />
              ) : (
                <p className="text-saprix-gray-700 font-inter leading-relaxed text-lg"></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
