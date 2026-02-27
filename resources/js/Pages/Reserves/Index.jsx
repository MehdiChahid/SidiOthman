import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ reserves }) {

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'haute':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'basse':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'haute':
                return '🔴';
            case 'moyenne':
                return '🟡';
            case 'basse':
                return '🟢';
            default:
                return '⚪';
        }
    };

    const getStatusColor = (statutName) => {
        if (statutName?.toLowerCase().includes('attente')) {
            return 'bg-orange-100 text-orange-800';
        } else if (statutName?.toLowerCase().includes('cours') || statutName?.toLowerCase().includes('traitement')) {
            return 'bg-blue-100 text-blue-800';
        } else if (statutName?.toLowerCase().includes('terminé') || statutName?.toLowerCase().includes('résolu')) {
            return 'bg-green-100 text-green-800';
        } else if (statutName?.toLowerCase().includes('rejeté') || statutName?.toLowerCase().includes('annulé')) {
            return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Mes Réserves
                    </h2>
                    <Link
                        href={route('reserves.create')}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg flex items-center"
                    >
                        <span className="text-xl mr-2">➕</span>
                        Nouvelle Réserve
                    </Link>
                </div>
            }
        >
            <Head title="Mes Réserves" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {reserves.length === 0 ? (
                        // Aucune réserve
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-8xl mb-6">📋</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Aucune réserve pour le moment
                            </h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                Vous n'avez pas encore créé de réserve. Commencez par signaler un problème !
                            </p>
                            <Link
                                href={route('reserves.create')}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg text-lg"
                            >
                                <span className="text-2xl mr-3">➕</span>
                                Créer ma première réserve
                            </Link>
                        </div>
                    ) : (
                        // Liste des réserves
                        <div className="space-y-6">
                            {reserves.map((reserve) => (
                                <div
                                    key={reserve.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-2xl font-bold text-gray-800">
                                                        {reserve.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getPriorityColor(reserve.priority)}`}>
                                                        {getPriorityIcon(reserve.priority)} {reserve.priority.charAt(0).toUpperCase() + reserve.priority.slice(1)}
                                                    </span>
                                                </div>
                                                
                                                {reserve.description && (
                                                    <p className="text-gray-600 mb-4 text-lg">
                                                        {reserve.description}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    {reserve.categor && (
                                                        <div className="flex items-center">
                                                            <span className="text-xl mr-2">🏷️</span>
                                                            <span className="font-semibold">{reserve.categor.name}</span>
                                                        </div>
                                                    )}
                                                    {reserve.appartement && (
                                                        <div className="flex items-center">
                                                            <span className="text-xl mr-2">🏠</span>
                                                            <span>Appt {reserve.appartement.numero} - Étage {reserve.appartement.etage}</span>
                                                        </div>
                                                    )}
                                                    {reserve.reported_at && (
                                                        <div className="flex items-center">
                                                            <span className="text-xl mr-2">📅</span>
                                                            <span>{new Date(reserve.reported_at).toLocaleDateString('fr-FR')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        <div className="ml-4">
                                            {(() => {
                                                // Supporter soit un objet unique, soit un tableau de suivis
                                                const suivis = Array.isArray(reserve.suivi)
                                                    ? reserve.suivi
                                                    : reserve.suivi
                                                    ? [reserve.suivi]
                                                    : [];
                                                const lastSuivi = suivis.length > 0 ? suivis[suivis.length - 1] : null;

                                                return lastSuivi?.statut ? (
                                                    <span className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${getStatusColor(lastSuivi.statut.name)}`}>
                                                        {lastSuivi.statut.name}
                                                    </span>
                                                ) : null;
                                            })()}
                                        </div>
                                        </div>

                                        {/* Photos miniatures */}
                                        {reserve.fichie?.fichierdetails && reserve.fichie.fichierdetails.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">📸</span>
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        {reserve.fichie.fichierdetails.length} photo{reserve.fichie.fichierdetails.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 overflow-x-auto">
                                                    {reserve.fichie.fichierdetails.slice(0, 4).map((photo) => (
                                                        <img
                                                            key={photo.id}
                                                            src={`/${photo.chemin_complet}`}
                                                            alt={photo.nom_fichier}
                                                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all"
                                                        />
                                                    ))}
                                                    {reserve.fichie.fichierdetails.length > 4 && (
                                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                                                            +{reserve.fichie.fichierdetails.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Bouton Voir détails */}
                                        <div className="flex justify-end pt-4 border-t border-gray-200">
                                            <Link
                                                href={route('reserves.show', reserve.id)}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md flex items-center"
                                            >
                                                Voir les détails
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
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

