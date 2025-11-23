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
      {
        protocol: "https",
        hostname: "trae-api-us.mchost.guru",
        port: "",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
