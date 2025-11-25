export const metadata = {
    title: 'Envíos - Saprix',
    description: 'Información sobre envíos y entregas de Saprix',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Envíos y Entregas
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Compromiso de Entrega
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Nuestro compromiso con el cliente es entregar en el menor tiempo posible. Por eso nos demoramos poco tiempo en despachar y usamos las empresas de mensajería con mejores índices de calidad y tiempo de entrega.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Tiempo de Entrega
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        El tiempo de entrega puede tardar un <strong>máximo de 3 a 4 días hábiles</strong> dependiendo de la ciudad del destinatario.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Proceso de Despacho
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Los despachos de los productos solo se hacen después de que el pago esté realizado y confirmado.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Costo de Envío
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        El envío lo asume el cliente y este varía según la entidad que el cliente elija, siempre y cuando esté al alcance de SAPRIX S.A.S la compañía transportadora.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
                        <p className="text-yellow-800 dark:text-yellow-200">
                            <strong>Importante:</strong> Se le sugiere al cliente asegurar su paquete por el valor REAL de la compra ya que si la mercancía se pierde NO somos responsables ante cualquier eventualidad.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Empresas de Mensajería
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Si el Usuario desea hacer uso de otra Empresa de mensajería debe hacerlo anticipadamente y de forma clara y explícita en su orden de pedido.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        SAPRIX S.A.S no se hace responsable por las demoras, costos adicionales o daños y perjuicios al usar este proveedor de mensajería. Los problemas con el envío serán responsabilidad exclusiva del Usuario. Cabe anotar que todos los gastos y costos adicionales son por cuenta del Usuario.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Cobertura
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Realizamos envíos a todo Colombia. Para envíos internacionales, por favor contáctenos directamente.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Seguimiento de Pedido
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Una vez despachado su pedido, recibirá un correo electrónico con el número de guía para que pueda hacer seguimiento de su envío.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        Contacto
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Para consultas sobre envíos, contáctenos en:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Email: <a href="mailto:servicioalcliente@pagos.saprix.com.co" className="text-saprix-electric-blue hover:underline">servicioalcliente@pagos.saprix.com.co</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
