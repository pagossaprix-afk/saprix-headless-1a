// En lib/woocommerce.ts

// ¡CRÍTICO! Esto garantiza que este código (y las llaves)
// NUNCA se ejecuten en el navegador del cliente.
import "server-only";

import API from "@woocommerce/woocommerce-rest-api";

const api = new API({
  url: process.env.WOOCOMMERCE_API_URL || "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
  version: "wc/v3", // Usamos la v3 de la API
});

export default api;