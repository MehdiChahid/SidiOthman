import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Accueil
                </h2>
            }
        >
            <Head title="Accueil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Message de bienvenue */}
                    <div className="mb-8 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl sm:rounded-2xl">
                        <div className="p-8 text-white">
                            <h1 className="text-3xl font-bold mb-2">Bienvenue sur votre espace de gestion des réserves 👋</h1>
                            <p className="text-lg text-blue-100">
                                Créez et suivez facilement toutes vos réserves de chantier
                            </p>
                        </div>
                    </div>

                    {/* Actions principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Bouton Créer une réserve */}
                        <Link
                            href={route('reserves.create')}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-6xl mb-4">➕</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            Créer une Réserve
                                        </h3>
                                        <p className="text-gray-600">
                                            Signalez un problème ou une anomalie dans votre appartement
                                        </p>
                                    </div>
                                    <div className="text-green-600 group-hover:translate-x-2 transition-transform duration-300">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                        </Link>

                        {/* Bouton Voir mes réserves */}
                        <Link
                            href={route('reserves.index')}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-6xl mb-4">📋</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            Mes Réserves
                                        </h3>
                                        <p className="text-gray-600">
                                            Consultez toutes vos réserves et leur état d'avancement
                                        </p>
                                    </div>
                                    <div className="text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        </Link>
                    </div>

        
        
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
