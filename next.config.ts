import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuramos next/image para cargar imágenes remotas desde WordPress
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.pagos.saprix.com.co",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "www.pagos.saprix.com.co",
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

  // Redirects para migración de /tienda a /productos
  async redirects() {
    return [
      {
        source: '/tienda',
        destination: '/productos',
        permanent: true,
      },
      {
        source: '/tienda/:path*',
        destination: '/productos/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
