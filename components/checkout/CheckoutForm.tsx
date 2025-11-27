"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { IoRefresh } from 'react-icons/io5';
import { toast } from 'sonner';

export default function CheckoutForm() {
    const { items, cartTotal } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentId: '',
        address: '',
        city: '',
        state: '',
        postcode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validar datos del formulario
            if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone) {
                toast.error('Por favor completa todos los campos obligatorios');
                setIsLoading(false);
                return;
            }

            // Llamar a la API para crear la orden y obtener el link de Wompi
            const response = await fetch('/api/checkout/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: items,
                    customer: customerData,
                    cartTotal: cartTotal,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al procesar el pago');
            }

            const data = await response.json();

            // Mostrar mensaje de éxito
            toast.success('Orden creada. Redirigiendo a la pasarela de pago...');

            // Pequeña pausa para que el usuario vea el mensaje
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirigir a Wompi
            window.location.href = data.permalink;

        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al procesar el pago. Intenta de nuevo.');
            setIsLoading(false);
        }
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

    if (!showCustomerForm) {
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

                    <button
                        onClick={() => setShowCustomerForm(true)}
                        className="w-full py-4 bg-[#f42121] hover:bg-[#d41c1c] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        Continuar al Pago
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-8"
            >
                {/* Formulario de Cliente */}
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Información de Envío</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={customerData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={customerData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={customerData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={customerData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cédula
                            </label>
                            <input
                                type="text"
                                name="documentId"
                                value={customerData.documentId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dirección
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={customerData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={customerData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Departamento
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={customerData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-saprix-electric-blue dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resumen y Botón de Pago */}
                <div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumen del Pedido</h3>

                        <div className="space-y-2 mb-6">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.variationId || 'base'}`} className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {item.name} x{item.quantity}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>${cartTotal.toLocaleString('es-CO')}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#f42121] hover:bg-[#d41c1c] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <IoRefresh className="animate-spin w-5 h-5" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                Pagar y Dominar la Cancha
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
                        Pago 100% seguro con Wompi - Certificación PCI DSS
                    </div>
                </div>
            </motion.form>
        </div>
    );
}
