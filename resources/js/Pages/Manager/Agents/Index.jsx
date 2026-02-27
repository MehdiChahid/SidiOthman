import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ agents }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gestion des Agents / Techniciens
                    </h2>
                    <Link
                        href={route('manager.agents.create')}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg flex items-center"
                    >
                        <span className="text-xl mr-2">➕</span>
                        Créer un Agent
                    </Link>
                </div>
            }
        >
            <Head title="Gestion des Agents" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {agents.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-8xl mb-6">👷</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Aucun agent pour le moment
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Créez votre premier agent/technicien
                            </p>
                            <Link
                                href={route('manager.agents.create')}
                                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
                            >
                                <span className="text-2xl mr-3">➕</span>
                                Créer un Agent
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agents.map((agent) => (
                                <div key={agent.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6">
                                    <div className="text-center mb-4">
                                        <div className="text-6xl mb-3">👷</div>
                                        <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-600 mr-2">📧</span>
                                            <span>{agent.email}</span>
                                        </div>
                                        {agent.phone && (
                                            <div className="flex items-center text-sm">
                                                <span className="text-gray-600 mr-2">📱</span>
                                                <span>{agent.phone}</span>
                                            </div>
                                        )}
                                        {agent.categor && (
                                            <div className="flex items-center text-sm">
                                                <span className="text-gray-600 mr-2">🔧</span>
                                                <span className="font-bold">{agent.categor.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={route('manager.agents.show', agent.id)}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-center"
                                        >
                                            Voir
                                        </Link>
                                        <Link
                                            href={route('manager.agents.edit', agent.id)}
                                            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 text-center"
                                        >
                                            Modifier
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

