"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    documentId: string; // Cédula/NIT
}

export default function CheckoutForm() {
    const { items, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        documentId: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: formData,
                    items: items,
                    total: cartTotal,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear la orden');
            }

            // Clear cart and redirect to payment gateway
            clearCart();
            window.location.href = `https://pagos.saprix.com.co?order_id=${data.orderId}`;

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Agrega productos para continuar con el pago.</p>
                <a href="/tienda" className="inline-block bg-saprix-electric-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-saprix-electric-blue-dark transition-colors">
                    Ir a la Tienda
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario de Envío */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Detalles de Facturación y Envío</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cédula / NIT</label>
                        <input
                            type="text"
                            name="documentId"
                            required
                            value={formData.documentId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                        <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departamento</label>
                            <input
                                type="text"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Postal</label>
                            <input
                                type="text"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-saprix-electric-blue focus:border-transparent"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-saprix-electric-blue text-white font-bold rounded-xl hover:bg-saprix-electric-blue-dark transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            'Realizar Pedido y Pagar'
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Resumen del Pedido */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl h-fit sticky top-24"
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

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>${cartTotal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Envío</span>
                        <span className="text-green-600 dark:text-green-400">Gratis</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                        <span>Total</span>
                        <span>${cartTotal.toLocaleString('es-CO')}</span>
                    </div>
                </div>

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Al realizar el pedido, serás redirigido a nuestra pasarela de pagos segura.
                </div>
            </motion.div>
        </div>
    );
}
