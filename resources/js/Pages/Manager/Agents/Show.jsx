import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ agent }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Détails de l'Agent
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('manager.agents.edit', agent.id)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                        >
                            Modifier
                        </Link>
                        <Link
                            href={route('manager.agents.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            ← Retour
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Agent: ${agent.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-4">👷</div>
                            <h1 className="text-3xl font-bold text-gray-800">{agent.name}</h1>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-4">📋 Informations</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-gray-600">📧 Email:</span> <span className="font-bold">{agent.email}</span></div>
                                    {agent.phone && (
                                        <div><span className="text-gray-600">📱 Téléphone:</span> <span className="font-bold">{agent.phone}</span></div>
                                    )}
                                    {agent.categor && (
                                        <div><span className="text-gray-600">🔧 Spécialité:</span> <span className="font-bold">{agent.categor.name}</span></div>
                                    )}
                                </div>
                            </div>

                            {agent.reserves_assignees && agent.reserves_assignees.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">📋 Réserves Assignées ({agent.reserves_assignees.length})</h3>
                                    <div className="space-y-3">
                                        {agent.reserves_assignees.map((reserve) => (
                                            <div key={reserve.id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="font-bold">{reserve.title}</div>
                                                <div className="text-sm text-gray-600">
                                                    {reserve.categor?.name} - {reserve.suivi?.statut?.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

