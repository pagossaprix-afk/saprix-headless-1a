export const metadata = {
    title: 'Términos y Condiciones - Saprix',
    description: 'Términos y condiciones de uso de Saprix',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Términos y Condiciones del Servicio
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Bienvenido a Saprix. Al acceder y utilizar este sitio web, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        1. Aceptación de Términos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Al utilizar este sitio web, confirmas que has leído, entendido y aceptado estos términos y condiciones, así como nuestra Política de Privacidad.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        2. Uso del Sitio
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Este sitio web está destinado únicamente para uso personal y no comercial. No puedes modificar, copiar, distribuir, transmitir, mostrar, realizar, reproducir, publicar, licenciar, crear trabajos derivados, transferir o vender cualquier información, software, productos o servicios obtenidos de este sitio web.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        3. Productos y Precios
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Todos los precios están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o descontinuar cualquier producto en cualquier momento sin responsabilidad hacia ti o cualquier tercero.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        4. Pedidos y Pagos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Nos reservamos el derecho de rechazar cualquier pedido que realices con nosotros. Podemos, a nuestra discreción, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        5. Propiedad Intelectual
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Todo el contenido incluido en este sitio, como texto, gráficos, logos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Saprix o de sus proveedores de contenido y está protegido por las leyes de derechos de autor.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        6. Limitación de Responsabilidad
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Saprix no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar este sitio web o cualquier producto comprado a través de él.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        7. Modificaciones
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        8. Ley Aplicable
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Estos términos y condiciones se rigen por las leyes de la República de Colombia. Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes de Colombia.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        9. Contacto
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos en:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Email: <a href="mailto:servicioalcliente@pagos.saprix.com.co" className="text-saprix-electric-blue hover:underline">servicioalcliente@pagos.saprix.com.co</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
