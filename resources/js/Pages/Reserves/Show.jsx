import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ reserve }) {
    const [selectedImage, setSelectedImage] = useState(null);

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Détails de la Réserve
                    </h2>
                    <Link
                        href={route('reserves.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                        ← Retour à la liste
                    </Link>
                </div>
            }
        >
            <Head title={`Réserve: ${reserve.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* En-tête */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-3">{reserve.title}</h1>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 bg-white ${getPriorityColor(reserve.priority)}`}>
                                            {getPriorityIcon(reserve.priority)} Priorité {reserve.priority}
                                        </span>
                                        {reserve.suivi?.statut && (
                                            <span className="px-4 py-2 rounded-full text-sm font-bold bg-white text-gray-800">
                                                {reserve.suivi.statut.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations principales */}
                        <div className="p-8 space-y-8">
                            {/* Localisation */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">📍</span>
                                    Localisation
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {reserve.projet && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Projet</p>
                                            <p className="font-bold text-gray-800">{reserve.projet.name}</p>
                                        </div>
                                    )}
                                    {reserve.secteur && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Secteur</p>
                                            <p className="font-bold text-gray-800">{reserve.secteur.name}</p>
                                        </div>
                                    )}
                                    {reserve.immeuble && (
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Immeuble</p>
                                            <p className="font-bold text-gray-800">{reserve.immeuble.name}</p>
                                        </div>
                                    )}
                                    {reserve.appartement && (
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Appartement</p>
                                            <p className="font-bold text-gray-800">
                                                N° {reserve.appartement.numero}<br/>
                                                Étage {reserve.appartement.etage}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Détails */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">📋</span>
                                    Détails
                                </h3>
                                <div className="space-y-4">
                                    {reserve.categor && (
                                        <div className="flex items-start">
                                            <span className="text-2xl mr-3">🏷️</span>
                                            <div>
                                                <p className="text-sm text-gray-600">Catégorie</p>
                                                <p className="text-lg font-bold text-gray-800">{reserve.categor.name}</p>
                                            </div>
                                        </div>
                                    )}
                                    {reserve.reported_at && (
                                        <div className="flex items-start">
                                            <span className="text-2xl mr-3">📅</span>
                                            <div>
                                                <p className="text-sm text-gray-600">Date de création</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {new Date(reserve.reported_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {reserve.description && (
                                        <div className="flex items-start">
                                            <span className="text-2xl mr-3">📄</span>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Description</p>
                                                <p className="text-gray-800 leading-relaxed">{reserve.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Photos */}
                            {reserve.fichie?.fichierdetails && reserve.fichie.fichierdetails.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">📸</span>
                                        Photos ({reserve.fichie.fichierdetails.length})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {reserve.fichie.fichierdetails.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="cursor-pointer group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
                                                onClick={() => setSelectedImage(`${photo.chemin_complet}`)}
                                            >
                                                <img
                                                    src={`/${photo.chemin_complet}`}
                                                    alt={photo.nom_fichier}
                                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Statut et suivi */}
                            {reserve.suivi && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">📊</span>
                                        Suivi
                                    </h3>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-lg font-bold text-gray-800">Statut actuel</span>
                                            {reserve.suivi.statut && (
                                                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
                                                    {reserve.suivi.statut.name}
                                                </span>
                                            )}
                                        </div>
                                        {reserve.suivi.description && (
                                            <p className="text-gray-700">{reserve.suivi.description}</p>
                                        )}
                                        {reserve.suivi.date && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Dernière mise à jour: {new Date(reserve.suivi.date).toLocaleDateString('fr-FR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal pour afficher l'image en grand */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-6xl max-h-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-all"
                        >
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <img
                            src={`/${selectedImage}`}
                            alt="Image agrandie"
                            className="max-w-full max-h-screen object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

