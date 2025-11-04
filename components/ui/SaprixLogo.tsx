"use client";
import Image from "next/image";

type SaprixLogoProps = {
  /** Fondo donde se coloca el logo: "light" (blanco/claros) o "dark" (azul/negros) */
  bg?: "light" | "dark";
  /** Usar la versión retina cuando esté disponible */
  retina?: boolean;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
};

export default function SaprixLogo({
  bg = "light",
  retina = true,
  width = 120,
  height = 28,
  className = "",
  alt = "Saprix",
  priority = false,
  sizes,
}: SaprixLogoProps) {
  const src = bg === "dark"
    ? retina
      ? "/Logo Saprix Negativo Retina.svg"
      : "/Logo Saprix Negativo.svg"
    : retina
      ? "/Logo Saprix. Retinasvg.svg"
      : "/Logo Saprix.svg";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes ?? `${width}px`}
    />
  );
}