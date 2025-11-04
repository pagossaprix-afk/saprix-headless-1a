import HeroSlider from '../components/home/HeroSlider';
import CategoryBanners from '../components/home/CategoryBanners';

export default function HomePage() {
  const FEATURED_CATEGORIES = [
    { name: "Zapatillas", slug: "zapatillas", img: "/placeholder-image.png" },
    { name: "Ropa", slug: "ropa", img: "/placeholder-image.png" },
    { name: "Accesorios", slug: "accesorios", img: "/placeholder-image.png" },
    { name: "Balones", slug: "balones", img: "/placeholder-image.png" },
  ];

  return (
    <main>
      <HeroSlider />
      <CategoryBanners />
      {/* ...aquí va el resto de la home... */}
    </main>
  );
}
