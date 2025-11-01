// ¡LA JUGADA MAESTRA! Esto lo convierte en Componente de Cliente 
"use client";

import { useState } from 'react'; 

// Tipos pa' que TypeScript no nos joda 
interface Variation { 
  id: number; 
  price: string; 
  attributes: { 
    name: string; 
    option: string; 
  }[]; 
} 

interface ProductFormProps { 
  product: any; 
  variations: Variation[]; 
} 

export default function ProductForm({ product, variations }: ProductFormProps) { 
  console.log("--- DEBUG CLIENTE (PROPS RECIBIDAS) ---"); 
  console.log("Producto (Cliente):", product); 
  console.log("Variaciones (Cliente):", variations); 
  
  // 1. Estado pa' guardar qué Talla escogió el cliente 
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null); 

  // 2. Lógica pa' pintar el precio 
  // Si hay una talla escogida, muestra el precio de esa talla. 
  // Si no, muestra el precio base del producto. 
  const displayPrice = selectedVariation ? selectedVariation.price : product.price; 

  // 3. Lógica pa' encontrar el atributo de Tallas (según auditoría: "Tallas" / slug "pa_tallas")
  // Normalizamos removiendo prefijos y comparando en minúsculas
  const normalize = (v: string | undefined) => (v || '').toLowerCase().replace(/^pa_/, '');
  const tallaAttribute = product.attributes.find(
    (attr: any) =>
      normalize(attr?.name) === 'tallas' || normalize(attr?.slug) === 'tallas'
  ); 
  console.log("--- DEBUG CLIENTE (LÓGICA TALLA) ---"); 
  console.log("¿Se encontró el atributo 'talla'?:", tallaAttribute); 
  
  // Si existe, sacamos las opciones (ej: ["38", "39", "40"]) 
  const tallaOptions = tallaAttribute ? tallaAttribute.options : []; 
  console.log("Opciones de Talla encontradas:", tallaOptions); 

  // 4. Función pa' cuando el cliente da clic en una Talla 
  const handleTallaClick = (talla: string) => { 
    // Buscamos en las variaciones cuál coincide con esa talla (atributo "Tallas")
    const variation = variations.find(v =>
      v.attributes.some(attr => normalize(attr?.name) === 'tallas' && attr.option === talla)
    );
    setSelectedVariation(variation || null); 
  }; 

  return ( 
    <div className="mt-8 pt-8 border-t border-saprix-indigo"> 
      
      {/* 1. Precio Dinámico */} 
      <p className="mt-4 text-3xl font-bold text-saprix-electric-blue"> 
        ${displayPrice} 
      </p> 

      {/* 2. Selector de Tallas (Swatches) */} 
      {product.type === 'variable' && tallaOptions.length > 0 && ( 
        <div className="mt-8"> 
          <h3 className="text-sm font-semibold text-saprix-white"> 
            TALLA: 
            <span className="ml-2 font-normal text-saprix-indigo"> 
              {selectedVariation 
                ? (selectedVariation.attributes.find(a => normalize(a?.name) === 'tallas')?.option || 'Selecciona una')
                : 'Selecciona una'} 
            </span> 
          </h3> 
          
          <div className="flex flex-wrap gap-3 mt-4"> 
            {tallaOptions.map((talla: string) => ( 
              <button 
                key={talla} 
                onClick={() => handleTallaClick(talla)} 
                className={` 
                  flex items-center justify-center h-12 w-12 rounded-lg border-2 
                  transition-all duration-200 
                  ${selectedVariation && (selectedVariation.attributes.find(a => normalize(a?.name) === 'tallas')?.option === talla) 
                    ? 'border-saprix-electric-blue bg-saprix-indigo' // Estilo "Seleccionado" 
                    : 'border-saprix-indigo bg-saprix-black-blue text-saprix-white hover:border-saprix-white' // Estilo "Normal" 
                  } 
                `} 
              > 
                <span className="font-semibold">{talla}</span> 
              </button> 
            ))} 
          </div> 
        </div> 
      )} 

      {/* 3. Botón de Añadir al Carrito (Fase 4.4 - ¡Próximo Camello!) */} 
      <div className="mt-10"> 
        <button 
          // ¡OJO! Si es variable Y no ha escogido talla, lo deshabilitamos 
          disabled={product.type === 'variable' && !selectedVariation} 
          className={` 
            w-full h-14 rounded-lg text-lg font-semibold 
            transition-all duration-200 
            ${(product.type === 'variable' && !selectedVariation) 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' // Deshabilitado 
              : 'bg-saprix-electric-blue text-saprix-white hover:bg-saprix-indigo' // Habilitado 
            } 
          `} 
        > 
          {/* ¡El UX Writing de la Biblia! */} 
          ¡DOMINA LA CANCHA! 
        </button> 
      </div> 
    </div> 
  ); 
}