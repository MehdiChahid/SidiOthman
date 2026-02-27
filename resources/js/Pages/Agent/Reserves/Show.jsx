import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';

export default function Show({ reserve, statuts, historiqueSuivis }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedAction, setSelectedAction] = useState(''); // 'start', 'resolved', 'not_resolved'
    
    const { data, setData, post, processing, errors, reset } = useForm({
        statut_id: '',
        description: '',
        photo: null,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setData('photo', null);
        setPreviewImage(null);
    };

    // Trouver le statut_id basé sur des mots-clés
    const getStatutIdFor = (actionType) => {
        if (!statuts || !Array.isArray(statuts)) return null;
        const findByKeywords = (keywords) =>
            statuts.find((s) =>
                keywords.some((k) => s.name.toLowerCase().includes(k))
            )?.id || null;

        switch (actionType) {
            case 'start':
                return findByKeywords(['cours', 'démarr', 'debut', 'en_cours']);
            case 'resolved':
                return findByKeywords(['corrigee', 'corrigé', 'résolu', 'resolu', 'termin']);
            case 'not_resolved':
                return findByKeywords(['non_corrigee', 'non corrig', 'rejet', 'imposs', 'annul']);
            default:
                return null;
        }
    };

    const handleActionSelect = (actionType) => {
        setSelectedAction(actionType);
        const statutId = getStatutIdFor(actionType);
        if (statutId) {
            setData('statut_id', statutId);
        }
        
        // Pré-remplir la description selon l'action
        switch (actionType) {
            case 'start':
                setData('description', 'Travail démarré par le technicien.');
                break;
            case 'resolved':
                setData('description', 'Problème corrigé par le technicien.');
                break;
            case 'not_resolved':
                setData('description', 'Problème non corrigé / intervention impossible.');
                break;
            default:
                setData('description', '');
        }
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        if (!selectedAction || !data.statut_id) {
            return;
        }
        post(route('agent.reserves.update-status', reserve.id), {
            preserveScroll: true,
            preserveState: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewImage(null);
                setSelectedAction('');
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                        href={route('agent.reserves.index')}
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
                                        {(() => {
                                            // Récupérer le dernier suivi pour afficher le statut actuel
                                            const suivis = Array.isArray(reserve.suivi)
                                                ? reserve.suivi
                                                : reserve.suivi
                                                ? [reserve.suivi]
                                                : [];
                                            const lastSuivi = suivis.length > 0 ? suivis[suivis.length - 1] : null;
                                            
                                            return lastSuivi?.statut ? (
                                                <span className="px-4 py-2 rounded-full text-sm font-bold bg-white text-gray-800">
                                                    {lastSuivi.statut.name}
                                                </span>
                                            ) : null;
                                        })()}
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
                                                {reserve.appartement.etage && `Étage ${reserve.appartement.etage}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Informations client */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">👤</span>
                                    Informations Client
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Nom</p>
                                            <p className="font-bold text-gray-800">{reserve.user?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Email</p>
                                            <p className="font-bold text-gray-800">{reserve.user?.email || 'N/A'}</p>
                                        </div>
                                        {reserve.user?.phone && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                                                <p className="font-bold text-gray-800">{reserve.user.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                                            <p className="font-bold text-gray-800">{reserve.categor?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Détails */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">📋</span>
                                    Détails
                                </h3>
                                <div className="space-y-4">
                                    {reserve.reported_at && (
                                        <div className="flex items-start">
                                            <span className="text-2xl mr-3">📅</span>
                                            <div>
                                                <p className="text-sm text-gray-600">Date de création</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {formatDate(reserve.reported_at)}
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

                            {/* Photos initiales */}
                            {reserve.fichie?.fichierdetails && reserve.fichie.fichierdetails.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">📸</span>
                                        Photos Initiales ({reserve.fichie.fichierdetails.length})
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

                            {/* Historique des suivis */}
                            {historiqueSuivis && historiqueSuivis.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">📊</span>
                                        Historique des Changements de Statut
                                    </h3>
                                    <div className="space-y-4">
                                        {historiqueSuivis.map((suivi, index) => (
                                            <div key={suivi.id} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">📌</span>
                                                        <div>
                                                            <p className="font-bold text-gray-800">
                                                                {index === 0 ? 'Statut Actuel' : `Changement #${historiqueSuivis.length - index}`}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatDate(suivi.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {suivi.statut && (
                                                        <span className={`px-4 py-2 rounded-lg font-bold ${
                                                            suivi.statut.name === 'Résolu' || suivi.statut.name === 'Fermé' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : suivi.statut.name === 'En cours'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {suivi.statut.name}
                                                        </span>
                                                    )}
                                                </div>
                                                {suivi.description && (
                                                    <p className="text-gray-700 mb-3">{suivi.description}</p>
                                                )}
                                                {suivi.fichie?.fichierdetails && suivi.fichie.fichierdetails.length > 0 && (
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-600 mb-2">
                                                            📷 Preuves ({suivi.fichie.fichierdetails.length})
                                                        </p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {suivi.fichie.fichierdetails.map((photo) => (
                                                                <div
                                                                    key={photo.id}
                                                                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
                                                                    onClick={() => setSelectedImage(`${photo.chemin_complet}`)}
                                                                >
                                                                    <img
                                                                        src={`/${photo.chemin_complet}`}
                                                                        alt={photo.nom_fichier}
                                                                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Formulaire de mise à jour de statut */}
                            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-2xl mr-2">✅</span>
                                    Mettre à jour le Statut
                                </h3>
                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    {/* Boutons d'action rapide */}
                                    <div>
                                        <label className="block font-semibold mb-3 text-gray-700">
                                            Action *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleActionSelect('start')}
                                                className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                                    selectedAction === 'start'
                                                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                                        : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50'
                                                }`}
                                            >
                                                <span className="text-2xl">🚀</span>
                                                <span>Débuter le travail</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleActionSelect('resolved')}
                                                className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                                    selectedAction === 'resolved'
                                                        ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                                        : 'bg-white text-green-700 border-2 border-green-300 hover:bg-green-50'
                                                }`}
                                            >
                                                <span className="text-2xl">✅</span>
                                                <span>Problème corrigé</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleActionSelect('not_resolved')}
                                                className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                                    selectedAction === 'not_resolved'
                                                        ? 'bg-red-600 text-white shadow-lg transform scale-105'
                                                        : 'bg-white text-red-700 border-2 border-red-300 hover:bg-red-50'
                                                }`}
                                            >
                                                <span className="text-2xl">⚠️</span>
                                                <span>Non corrigé</span>
                                            </button>
                                        </div>
                                        <InputError message={errors.statut_id} className="mt-2" />
                                        {!selectedAction && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Veuillez sélectionner une action ci-dessus
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-2 text-gray-700">
                                            Description / Commentaire
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="4"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder={
                                                selectedAction === 'start'
                                                    ? "Décrivez le début du travail, les actions prévues..."
                                                    : selectedAction === 'resolved'
                                                    ? "Décrivez comment le problème a été corrigé..."
                                                    : selectedAction === 'not_resolved'
                                                    ? "Expliquez pourquoi le problème n'a pas pu être corrigé..."
                                                    : "Décrivez l'état actuel de la réserve, les actions effectuées..."
                                            }
                                        ></textarea>
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-2 text-gray-700">
                                            📷 Photo de Preuve (optionnelle)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                id="photo-upload"
                                            />
                                            {previewImage ? (
                                                <div className="relative">
                                                    <img
                                                        src={`${previewImage}`}
                                                        alt="Aperçu"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removePhoto}
                                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="photo-upload"
                                                    className="cursor-pointer flex flex-col items-center justify-center py-8"
                                                >
                                                    <div className="text-4xl mb-2">📷</div>
                                                    <p className="text-gray-600 font-semibold">
                                                        Cliquez pour ajouter une photo
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Format: JPG, PNG (max 5MB)
                                                    </p>
                                                </label>
                                            )}
                                        </div>
                                        <InputError message={errors.photo} className="mt-2" />
                                    </div>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                        <span className="text-lg mr-2">ℹ️</span>
                                        Chaque changement de statut créera une nouvelle entrée dans l'historique avec la date et la photo (si fournie).
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !selectedAction || !data.statut_id}
                                        className={`w-full px-6 py-3 rounded-xl font-bold transition-all ${
                                            processing || !selectedAction || !data.statut_id
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : selectedAction === 'start'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : selectedAction === 'resolved'
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    >
                                        {processing 
                                            ? 'Mise à jour...' 
                                            : selectedAction === 'start'
                                            ? '🚀 Confirmer le début du travail'
                                            : selectedAction === 'resolved'
                                            ? '✅ Confirmer la correction'
                                            : selectedAction === 'not_resolved'
                                            ? '⚠️ Confirmer le non-correction'
                                            : 'Choisissez une action'}
                                    </button>
                                </form>
                            </div>
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

