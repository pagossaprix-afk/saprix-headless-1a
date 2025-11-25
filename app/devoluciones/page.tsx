export const metadata = {
    title: 'Devoluciones y Reembolsos - Saprix',
    description: 'Política de devoluciones y reembolsos de Saprix',
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Devoluciones y Reembolsos
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Política de Devoluciones
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Nuestra política dura <strong>30 días</strong>. Si pasaron 30 días desde su compra, desafortunadamente no podemos ofrecerle un reembolso ni un cambio.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Requisitos para Devolución
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Para ser elegible para una devolución, su artículo debe cumplir con las siguientes condiciones:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                        <li>Debe estar sin usar y en la misma condición en que lo recibió</li>
                        <li>Debe estar en el embalaje original</li>
                        <li>Debe presentar el recibo o comprobante de compra</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Productos No Elegibles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Los siguientes tipos de productos están exentos de devolución:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                        <li>Productos perecederos (alimentos, flores, periódicos o revistas)</li>
                        <li>Productos íntimos o sanitarios</li>
                        <li>Materiales peligrosos o líquidos/gases inflamables</li>
                        <li>Tarjetas de regalo</li>
                    </ul>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        <strong>Importante:</strong> No devuelva su compra al fabricante.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Reembolsos Parciales
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Hay ciertas situaciones en las que solo se otorgan reembolsos parciales (si corresponde):
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                        <li>Cualquier artículo que no se encuentre en su estado original, esté dañado o le falten piezas por razones que no se deban a nuestro error</li>
                        <li>Cualquier artículo devuelto más de 30 días después de la entrega</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Proceso de Reembolso
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Una vez recibida e inspeccionada su devolución, le enviaremos un correo electrónico para notificarle que recibimos el artículo que devolvió. También le notificaremos sobre la aprobación o el rechazo de su reembolso.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Si se aprueba, se procesará su reembolso y se aplicará un crédito automáticamente en su tarjeta de crédito o método de pago original, dentro de una cierta cantidad de días.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Reembolsos Tardíos o Faltantes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Si aún no ha recibido un reembolso, primero verifique su cuenta bancaria nuevamente. Luego, comuníquese con la compañía de su tarjeta de crédito, ya que puede tomar algún tiempo antes de que su reembolso se publique oficialmente.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Si ha hecho todo esto y aún no ha recibido su reembolso, contáctenos en: <a href="mailto:servicioalcliente@pagos.saprix.com.co" className="text-saprix-electric-blue hover:underline">servicioalcliente@pagos.saprix.com.co</a>
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Contacto
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Para iniciar una devolución o si tiene preguntas, contáctenos en:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Email: <a href="mailto:servicioalcliente@pagos.saprix.com.co" className="text-saprix-electric-blue hover:underline">servicioalcliente@pagos.saprix.com.co</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
