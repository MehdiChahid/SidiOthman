import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ManagerDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tableau de Bord - Manager
                </h2>
            }
        >
            <Head title="Dashboard Manager" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Message de bienvenue */}
                    <div className="mb-8 overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 shadow-xl sm:rounded-2xl">
                        <div className="p-8 text-white">
                            <h1 className="text-3xl font-bold mb-2">Bienvenue dans votre espace de gestion 👋</h1>
                            <p className="text-lg text-purple-100">
                                Gérez les réserves, les agents et suivez tous les chantiers
                            </p>
                        </div>
                    </div>

                    {/* Actions principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Créer une réserve pour un client */}
                        <Link
                            href={route('manager.reserves.create')}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-5xl mb-3">➕</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Créer une Réserve
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Créer une réserve pour un client
                                        </p>
                                    </div>
                                    <div className="text-green-600 group-hover:translate-x-2 transition-transform duration-300">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                        </Link>

                        {/* Toutes les réserves */}
                        <Link
                            href={route('manager.reserves.index')}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-5xl mb-3">📋</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Toutes les Réserves
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Voir et gérer toutes les réserves avec filtres
                                        </p>
                                    </div>
                                    <div className="text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        </Link>

                        {/* Gérer les agents */}
                        <Link
                            href={route('manager.agents.index')}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-5xl mb-3">👷</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Gérer les Agents
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Créer et gérer les techniciens/agents
                                        </p>
                                    </div>
                                    <div className="text-purple-600 group-hover:translate-x-2 transition-transform duration-300">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                        </Link>

                        {/* Réserves en attente */}
                        <Link
                            href={route('manager.reserves.index', { status: 'en_attente' })}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-5xl mb-3">⏳</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            En Attente
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Valider et affecter les réserves
                                        </p>
                                    </div>
                                    <div className="text-orange-600 group-hover:translate-x-2 transition-transform duration-300">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                        </Link>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                            <div className="text-4xl mb-3">📊</div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Gestion Complète</h4>
                            <p className="text-gray-600 text-sm">
                                Gérez toutes les réserves de tous les clients
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                            <div className="text-4xl mb-3">👥</div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Gestion des Agents</h4>
                            <p className="text-gray-600 text-sm">
                                Créez et affectez les techniciens par spécialité
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                            <div className="text-4xl mb-3">✅</div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Validation & Affectation</h4>
                            <p className="text-gray-600 text-sm">
                                Validez et affectez les réserves aux techniciens
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
