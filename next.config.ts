import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuramos next/image para cargar imágenes remotas desde WordPress
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
