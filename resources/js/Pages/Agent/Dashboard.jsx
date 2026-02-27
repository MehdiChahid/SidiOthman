import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Agent
                </h2>
            }
        >
            <Head title="Dashboard Agent" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4">🔧</div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Bienvenue, {auth.user.name} !
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Gérez vos réserves assignées
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                <Link
                                    href={route('agent.reserves.index')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all"
                                >
                                    <div className="text-4xl mb-4">📋</div>
                                    <h3 className="text-xl font-bold mb-2">Mes Réserves</h3>
                                    <p className="text-blue-100">
                                        Consultez toutes les réserves qui vous sont assignées
                                    </p>
                                </Link>

                                <div className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 shadow-lg">
                                    <div className="text-4xl mb-4">✅</div>
                                    <h3 className="text-xl font-bold mb-2">Réserves en Cours</h3>
                                    <p className="text-green-100">
                                        Suivez vos interventions en cours
                                    </p>
                                </div>

                                <div className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-6 shadow-lg">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h3 className="text-xl font-bold mb-2">Statistiques</h3>
                                    <p className="text-purple-100">
                                        Consultez vos performances
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

