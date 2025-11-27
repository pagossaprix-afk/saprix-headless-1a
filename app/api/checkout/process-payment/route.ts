import { NextResponse } from 'next/server';

// Configuración de WooCommerce
const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY || "ck_88721898d82f29e0f8664d7e3316aa460340f587";
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET || "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

// Configuración de Wompi
const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_your_key_here";
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY || "prv_test_your_key_here";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, cartItems, cartTotal } = body;

        if (!customer || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        // 1. CREAR ORDEN EN WOOCOMMERCE
        const line_items = cartItems.map((item: any) => ({
            product_id: item.id,
            variation_id: item.variationId || undefined,
            quantity: item.quantity,
        }));

        const orderData = {
            payment_method: 'wompi',
            payment_method_title: 'Pago con Wompi',
            set_paid: false,
            billing: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: customer.state,
                postcode: customer.postcode,
                country: 'CO',
                email: customer.email,
                phone: customer.phone,
            },
            shipping: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: customer.state,
                postcode: customer.postcode,
                country: 'CO',
            },
            line_items: line_items,
            meta_data: [
                {
                    key: '_billing_cedula',
                    value: customer.documentId
                }
            ]
        };

        // Crear orden en WooCommerce
        const wooResponse = await fetch(`${WOO_URL}/wp-json/wc/v3/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64'),
            },
            body: JSON.stringify(orderData),
        });

        const wooOrder = await wooResponse.json();

        if (!wooResponse.ok) {
            console.error('WooCommerce Error:', wooOrder);
            throw new Error(wooOrder.message || 'Error al crear la orden en WooCommerce');
        }

        const orderId = wooOrder.id;
        const orderKey = wooOrder.order_key;

        // 2. INTENTAR CREAR TRANSACCIÓN EN WOMPI (OPCIONAL - CON FALLBACK)
        // Si Wompi no está configurado o falla, redirigir a WooCommerce checkout

        try {
            // Solo intentar Wompi si las llaves están configuradas correctamente
            if (WOMPI_PUBLIC_KEY && !WOMPI_PUBLIC_KEY.includes('test_your_key')) {
                const amountInCents = Math.round(cartTotal * 100);
                const reference = `SAPRIX-${orderId}`;

                const wompiPayload = {
                    amount_in_cents: amountInCents,
                    currency: 'COP',
                    customer_email: customer.email,
                    reference: reference,
                    redirect_url: `${SITE_URL}/orden-confirmada?order_id=${orderId}`,
                    customer_data: {
                        phone_number: customer.phone,
                        full_name: `${customer.firstName} ${customer.lastName}`,
                        legal_id: customer.documentId,
                        legal_id_type: 'CC'
                    },
                    shipping_address: {
                        address_line_1: customer.address,
                        city: customer.city,
                        region: customer.state,
                        country: 'CO',
                        phone_number: customer.phone
                    }
                };

                const wompiResponse = await fetch('https://production.wompi.co/v1/transactions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(wompiPayload),
                });

                if (wompiResponse.ok) {
                    const wompiData = await wompiResponse.json();
                    const permalink = wompiData.data?.permalink || wompiData.data?.payment_link_url;

                    if (permalink) {
                        return NextResponse.json({
                            success: true,
                            permalink,
                            orderId,
                            reference,
                            provider: 'wompi'
                        });
                    }
                }
            }
        } catch (wompiError) {
            console.log('Wompi no disponible, usando checkout de WooCommerce:', wompiError);
        }

        // 3. FALLBACK: REDIRIGIR A WOOCOMMERCE CHECKOUT
        // Si Wompi falla o no está configurado, usar el checkout nativo de WooCommerce
        const wooCheckoutUrl = `${WOO_URL}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

        return NextResponse.json({
            success: true,
            permalink: wooCheckoutUrl,
            orderId,
            orderKey,
            provider: 'woocommerce'
        });

    } catch (error: any) {
        console.error('Error en proceso de pago:', error);
        return NextResponse.json(
            { error: error.message || 'Error al procesar el pago' },
            { status: 500 }
        );
    }
}
