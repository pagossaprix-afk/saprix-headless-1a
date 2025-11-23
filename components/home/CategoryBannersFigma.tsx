"use client";

import Link from "next/link";
import { 
  IoShirt, 
  IoWoman, 
  IoHappy, 
  IoFlame,
  IoFootsteps,
  IoGolf,
  IoColorPalette,
  IoStar
} from "react-icons/io5";
import { GiRunningShoe, GiSoccerKick, GiBasketballBasket, GiTennisRacket } from "react-icons/gi";
import { layout } from "@/lib/design-system";
import { Section, Container, Grid } from "@/lib/ui/layouts";
import { MotionDiv } from "@/lib/ui/motion";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  gradient: string;
  productCount: number;
}

const categories: Category[] = [
  {
    id: "hombre",
    name: "Hombre",
    description: "Zapatillas y accesorios de futsal masculino",
    icon: IoShirt,
    href: "/tienda?category=hombre",
    color: "text-saprix-electric-blue",
    gradient: "from-saprix-electric-blue to-saprix-electric-blue-light",
    productCount: 127
  },
  {
    id: "mujer", 
    name: "Mujer",
    description: "Colección especializada para mujeres deportistas",
    icon: IoWoman,
    href: "/tienda?category=mujer",
    color: "text-saprix-red-orange",
    gradient: "from-saprix-red-orange to-orange-500",
    productCount: 89
  },
  {
    id: "ninos",
    name: "Niños",
    description: "Diversión y seguridad para los más pequeños",
    icon: IoHappy,
    href: "/tienda?category=ninos", 
    color: "text-green-600",
    gradient: "from-green-500 to-green-600",
    productCount: 45
  },
  {
    id: "sala",
    name: "Sala",
    description: "Especializadas para canchas de futsal",
    icon: GiSoccerKick,
    href: "/tienda?category=sala",
    color: "text-purple-600", 
    gradient: "from-purple-600 to-purple-700",
    productCount: 156
  },
  {
    id: "velocidad",
    name: "Velocidad",
    description: "Máxima rapidez en cada movimiento",
    icon: GiRunningShoe,
    href: "/tienda?category=velocidad",
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-yellow-600",
    productCount: 67
  },
  {
    id: "agarre",
    name: "Agarre",
    description: "Control total del balón",
    icon: IoGolf,
    href: "/tienda?category=agarre",
    color: "text-blue-600",
    gradient: "from-blue-600 to-blue-700",
    productCount: 78
  },
  {
    id: "ofertas",
    name: "Ofertas",
    description: "Los mejores precios del mercado",
    icon: IoFlame,
    href: "/tienda?category=ofertas",
    color: "text-red-600",
    gradient: "from-red-600 to-red-700",
    productCount: 34
  },
  {
    id: "accesorios",
    name: "Accesorios",
    description: "Complementos para tu juego",
    icon: IoColorPalette,
    href: "/tienda?category=accesorios",
    color: "text-indigo-600",
    gradient: "from-indigo-600 to-indigo-700",
    productCount: 92
  }
];

export default function CategoryBannersFigma() {
  return (
    <Section bg="bg-saprix-gray-50" spacing="lg">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="saprix-h2 saprix-title-underline mb-4">
            Categorías Populares
          </h2>
          <p className="saprix-body max-w-2xl mx-auto">
            Descubre nuestras colecciones especializadas para cada estilo de juego
          </p>
        </div>

        {/* Categories Grid */}
        <Grid columns={4} gap="md">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <MotionDiv key={category.id}>
              <Link
                key={category.id}
                href={category.href}
                className={`group relative overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${category.gradient} ${layout.flexCenter} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-inter font-bold text-saprix-gray-900 mb-2 group-hover:text-saprix-electric-blue transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-saprix-gray-600 font-inter mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Product Count */}
                  <div className="inline-flex items-center px-3 py-1 bg-saprix-lime text-black text-sm font-inter">
                    <span className="font-extrabold">{category.productCount}</span>
                    <span className="ml-1">productos</span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className={`w-8 h-8 ${category.color} ${layout.flexCenter}`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Border Animation */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-saprix-electric-blue transition-all duration-300 opacity-0 group-hover:opacity-100`} />
              </Link>
              </MotionDiv>
            );
          })}
        </Grid>

         {/* Call to Action */}
         <div className="text-center mt-16">
           <Link
             href="/tienda"
            className="btn-primary px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
           >
             Ver Todas las Categorías
             <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </Link>
         </div>
      </Container>
    </Section>
  );
}
