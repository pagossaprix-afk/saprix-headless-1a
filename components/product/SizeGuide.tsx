"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Ruler } from 'lucide-react';
import Image from 'next/image';

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    categories: string[];
}

const GUIDES = [
    { id: 'kids', name: 'Saprix Kids', keywords: ['kids', 'niño', 'niña', 'infantil'], image: '/size-guide-kids.jpg' },
    { id: 'londres', name: 'Referencia Londres', keywords: ['londres'], image: '/size-guide-londres.jpg' },
    { id: 'roma', name: 'Referencia Roma', keywords: ['roma'], image: '/size-guide-roma.jpg' },
    { id: 'tokio', name: 'Referencia Tokio', keywords: ['tokio'], image: '/size-guide-tokio.jpg' },
];

export default function SizeGuide({ isOpen, onClose, productName, categories }: SizeGuideProps) {
    const [activeGuide, setActiveGuide] = useState(GUIDES[0]);

    useEffect(() => {
        if (isOpen) {
            const searchString = `${productName} ${categories.join(' ')}`.toLowerCase();
            const found = GUIDES.find(g => g.keywords.some(k => searchString.includes(k)));
            if (found) {
                setActiveGuide(found);
            }
        }
    }, [isOpen, productName, categories]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all -skew-x-6">
                                <div className="skew-x-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                            <Ruler className="w-6 h-6 text-saprix-electric-blue" />
                                            Guía de Tallas
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-gray-100 transition-colors -skew-x-6 border border-transparent hover:border-gray-200"
                                        >
                                            <X className="w-6 h-6 text-gray-500 skew-x-6" />
                                        </button>
                                    </div>

                                    {/* Tabs for manual selection */}
                                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                                        {GUIDES.map((guide) => (
                                            <button
                                                key={guide.id}
                                                onClick={() => setActiveGuide(guide)}
                                                className={`px-4 py-2 text-sm font-medium transition-all -skew-x-6 ${activeGuide.id === guide.id
                                                    ? 'bg-saprix-electric-blue text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span className="block skew-x-6">{guide.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border border-gray-100 -skew-x-6">
                                        <div className="skew-x-6 w-full h-full relative">
                                            <Image
                                                src={activeGuide.image}
                                                alt={`Guía de tallas ${activeGuide.name}`}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 800px"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-blue-50 p-4 -skew-x-6">
                                        <div className="skew-x-6">
                                            <h4 className="font-semibold text-blue-900 mb-2">¿Cómo medir tu pie?</h4>
                                            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                                <li>Coloca una hoja de papel en el suelo pegada a la pared.</li>
                                                <li>Pon tu pie sobre la hoja con el talón pegado a la pared.</li>
                                                <li>Marca con un lápiz hasta donde llega tu dedo más largo.</li>
                                                <li>Mide la distancia desde el borde de la hoja hasta la marca.</li>
                                                <li>Busca la medida en la tabla para encontrar tu talla correcta.</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
