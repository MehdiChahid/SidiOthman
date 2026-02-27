import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function CreateUserModal({ show, onClose, onSuccess, appartementId, projetId, secteurId, immeubleId }) {
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        appartement_id: appartementId || '',
        projet_id: projetId || '',
        secteur_id: secteurId || '',
        immeuble_id: immeubleId || '',
    });

    // Mettre à jour les IDs quand ils changent
    useEffect(() => {
        if (show) {
            setData({
                ...data,
                appartement_id: appartementId || '',
                projet_id: projetId || '',
                secteur_id: secteurId || '',
                immeuble_id: immeubleId || '',
            });
        }
    }, [appartementId, projetId, secteurId, immeubleId, show]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        
        // Mettre à jour les IDs avant l'envoi
        const formData = {
            ...data,
            appartement_id: appartementId || '',
            projet_id: projetId || '',
            secteur_id: secteurId || '',
            immeuble_id: immeubleId || '',
        };
        
        // Utiliser axios directement pour intercepter la réponse JSON
        // Axios est configuré dans bootstrap.js avec les headers par défaut
        // Le token CSRF est automatiquement géré par Laravel via le meta tag
        try {
            const response = await axios.post(route('users.store'), formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.data && response.data.user) {
                // Succès : appeler le callback onSuccess avec l'utilisateur créé
                if (onSuccess) {
                    onSuccess(response.data.user);
                }
                // Réinitialiser et fermer le modal
                reset();
                clearErrors();
                onClose();
            }
        } catch (error) {
            // Gérer les erreurs de validation
            if (error.response && error.response.status === 422 && error.response.data.errors) {
                // Les erreurs de validation sont dans error.response.data.errors
                // On peut les afficher manuellement ou utiliser useForm pour les gérer
                console.error('Erreurs de validation:', error.response.data.errors);
                // Note: Pour une meilleure gestion, on pourrait mapper ces erreurs vers useForm
                // mais pour l'instant, on les affiche via les messages d'erreur du serveur
            } else {
                console.error('Erreur lors de la création de l\'utilisateur:', error);
            }
        }
    };

    const handleClose = () => {
        // Réinitialiser le formulaire lors de la fermeture
        reset();
        clearErrors();
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <span className="text-2xl mr-3">👤</span>
                            Créer un Nouveau Client
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 text-2xl font-bold transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div  className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nom complet *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                                errors.name ? 'border-red-300' : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="Ex: Jean Dupont"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                                errors.email ? 'border-red-300' : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="exemple@email.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                                errors.phone ? 'border-red-300' : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="+212 6XX XXX XXX"
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mot de passe *
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                                errors.password ? 'border-red-300' : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="Minimum 8 caractères"
                            required
                            minLength={8}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirmer le mot de passe *
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                                errors.password_confirmation || (data.password && data.password !== data.password_confirmation) 
                                    ? 'border-red-300' 
                                    : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="Répétez le mot de passe"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
                        )}
                        {data.password && data.password !== data.password_confirmation && (
                            <p className="text-red-600 text-sm mt-1">Les mots de passe ne correspondent pas</p>
                        )}
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                        <span className="text-lg mr-2">ℹ️</span>
                        Cet appartement sera automatiquement affecté à ce nouveau client.
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleCreateUser}
                            disabled={
                                processing || 
                                !data.name || 
                                !data.email || 
                                !data.password || 
                                data.password !== data.password_confirmation
                            }
                            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                                processing || 
                                !data.name || 
                                !data.email || 
                                !data.password || 
                                data.password !== data.password_confirmation
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {processing ? 'Création...' : '✓ Créer et Affecter'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
