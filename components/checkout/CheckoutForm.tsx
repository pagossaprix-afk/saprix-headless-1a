"use client";

import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export default function CheckoutForm() {
    const { items, cartTotal } = useCart();

    const handleCheckout = () => {
        // Build URL parameters to add products to WooCommerce cart
        const cartParams = items.map(item => {
            // If product has variation, use variation_id, otherwise use product_id
            if (item.variationId) {
                return `add-to-cart=${item.id}&variation_id=${item.variationId}&quantity=${item.quantity}`;
            } else {
                return `add-to-cart=${item.id}&quantity=${item.quantity}`;
            }
        }).join('&');

        // Redirect to WooCommerce checkout with cart items
        window.location.href = `https://pagos.saprix.com.co/checkout/?${cartParams}`;
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Agrega productos para continuar con el pago.</p>
                <a href="/productos" className="inline-block bg-saprix-electric-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-saprix-electric-blue-dark transition-colors">
                    Ir a la Tienda
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Resumen del Pedido */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumen del Pedido</h3>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.variationId || 'base'}`} className="flex gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-bl-lg">
                                    x{item.quantity}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{item.name}</h4>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                                        <span key={key} className="mr-2">{key}: {value}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toLocaleString('es-CO')}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>${cartTotal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                        <span>Total</span>
                        <span>${cartTotal.toLocaleString('es-CO')}</span>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Al hacer clic en "Proceder al Pago", serás redirigido a nuestro checkout seguro donde podrás completar tus datos de envío y realizar el pago.
                    </p>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-saprix-electric-blue text-white font-bold rounded-xl hover:bg-saprix-electric-blue-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    Proceder al Pago
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Pago 100% seguro con certificación PCI DSS
                </div>
            </motion.div>
        </div>
    );
}
