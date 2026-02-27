import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import StepIndicator from '@/Components/StepIndicator';
import CreateUserModal from '@/Components/CreateUserModal';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Create({ categories, examples, projets }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [previewImages, setPreviewImages] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [immeubles, setImmeubles] = useState([]);
    const [appartements, setAppartements] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        projet_id: '',
        secteur_id: '',
        immeuble_id: '',
        appartement_id: '',
        title: '',
        description: '',
        categor_id: '',
        priority: 'moyenne',
        photos: [],
    });

    const steps = [
        { icon: '📍', title: 'Localisation', description: 'Sélectionnez la localisation' },
        { icon: '❓', title: 'Problème', description: 'Quel est le problème ?' },
        { icon: '🏷️', title: 'Type', description: 'Quel type de problème ?' },
        { icon: '⚡', title: 'Urgence', description: 'Quelle est l\'urgence ?' },
        { icon: '📸', title: 'Photos', description: 'Ajoutez des photos' }
    ];

    useEffect(() => {
        if (data.projet_id && currentStep === 1) {
            loadSecteurs(data.projet_id);
        }
    }, [data.projet_id, currentStep]);

    useEffect(() => {
        if (data.secteur_id && currentStep === 1) {
            loadImmeubles(data.secteur_id);
        }
    }, [data.secteur_id, currentStep]);

    useEffect(() => {
        if (data.immeuble_id && currentStep === 1) {
            loadAppartements(data.immeuble_id);
        }
    }, [data.immeuble_id, currentStep]);

    const loadSecteurs = async (projetId) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/registration/secteurs', {
                params: { projet_id: projetId }
            });
            setSecteurs(response.data);
        } catch (error) {
            console.error('Erreur chargement secteurs:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadImmeubles = async (secteurId) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/registration/immeubles', {
                params: { secteur_id: secteurId }
            });
            setImmeubles(response.data);
        } catch (error) {
            console.error('Erreur chargement immeubles:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAppartements = async (immeubleId) => {
        setLoading(true);
        try {
            // Charger tous les appartements (y compris ceux déjà affectés pour le manager)
            const response = await axios.get('/api/registration/appartements-all', {
                params: { immeuble_id: immeubleId }
            });
            setAppartements(response.data || []);
        } catch (error) {
            console.error('Erreur chargement appartements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAppartementSelect = async (appartementId) => {
        setData('appartement_id', appartementId);
        
        // Trouver l'appartement dans la liste chargée
        const appartement = appartements.find(apt => apt.id == appartementId);
        
        if (appartement && appartement.user_id) {
            // Si l'appartement a déjà un client
            setData('user_id', appartement.user_id);
            
            // Si on a déjà les infos du user dans la réponse
            if (appartement.user) {
                setSelectedClient(appartement.user);
            } else {
                // Sinon charger les infos du client
                try {
                    const response = await axios.get(`/api/appartements/${appartementId}/client`);
                    if (response.data && response.data.user) {
                        setSelectedClient(response.data.user);
                    }
                } catch (error) {
                    console.error('Erreur récupération client:', error);
                }
            }
        } else {
            // Si pas de client, ouvrir la modal pour créer un utilisateur
            setData('user_id', '');
            setSelectedClient(null);
            setShowUserModal(true);
        }
    };

    const handleUserCreated = (user) => {
        setSelectedClient(user);
        setData('user_id', user.id);
        
        // Recharger les appartements pour mettre à jour l'affichage
        if (data.immeuble_id) {
            loadAppartements(data.immeuble_id);
        }
    };

    const handleCloseModal = () => {
        setShowUserModal(false);
        // Si on ferme la modal sans créer d'utilisateur, réinitialiser la sélection d'appartement
        if (!data.user_id) {
            setData('appartement_id', '');
        }
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const removePhoto = (index) => {
        const newPhotos = Array.from(data.photos);
        newPhotos.splice(index, 1);
        setData('photos', newPhotos);
        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleExampleClick = (example) => {
        setData('title', example.title);
        setData('description', example.description || '');
        setData('categor_id', example.categor_id);
        setData('priority', example.priority);
        setCurrentStep(5);
    };

    const handleNext = () => {
        if (currentStep === 1 && (!data.projet_id || !data.secteur_id || !data.immeuble_id || !data.appartement_id || !data.user_id)) {
            alert('Veuillez sélectionner un appartement pour continuer. Un appartement sans client ne peut pas avoir de réserve.');
            return;
        }
        if (currentStep === 2 && !data.title) return;
        if (currentStep === 3 && !data.categor_id) return;
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('manager.reserves.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Créer une Réserve pour un Client
                    </h2>
                    <Link
                        href={route('manager.reserves.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                        ← Retour
                    </Link>
                </div>
            }
        >
            <Head title="Créer une Réserve" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <StepIndicator currentStep={currentStep} totalSteps={5} steps={steps} />

                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mt-8">
                        <form onSubmit={submit} className="p-8">
                            {/* Étape 1: Localisation */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">📍</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Sélectionnez la localisation</h3>
                                    </div>
                                    {/* Projet */}
                                    <div>
                                        <label className="block text-lg font-semibold mb-2">🏗️ Projet *</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {projets.map((projet) => (
                                                <button
                                                    key={projet.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setData('projet_id', projet.id);
                                                        loadSecteurs(projet.id);
                                                        setData('secteur_id', '');
                                                        setData('immeuble_id', '');
                                                        setData('appartement_id', '');
                                                    }}
                                                    className={`p-4 rounded-xl border-3 text-left ${
                                                        data.projet_id === projet.id
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    <div className="font-bold">{projet.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Secteur */}
                                    {data.projet_id && (
                                        <div>
                                            <label className="block text-lg font-semibold mb-2">📍 Secteur *</label>
                                            {loading ? (
                                                <div className="text-center py-8">Chargement...</div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {secteurs.map((secteur) => (
                                                        <button
                                                            key={secteur.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setData('secteur_id', secteur.id);
                                                                loadImmeubles(secteur.id);
                                                                setData('immeuble_id', '');
                                                                setData('appartement_id', '');
                                                            }}
                                                            className={`p-4 rounded-xl border-3 ${
                                                                data.secteur_id === secteur.id
                                                                    ? 'border-green-600 bg-green-50'
                                                                    : 'border-gray-300'
                                                            }`}
                                                        >
                                                            {secteur.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Immeuble */}
                                    {data.secteur_id && (
                                        <div>
                                            <label className="block text-lg font-semibold mb-2">🏢 Immeuble *</label>
                                            {loading ? (
                                                <div className="text-center py-8">Chargement...</div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-4">
                                                    {immeubles.map((immeuble) => (
                                                        <button
                                                            key={immeuble.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setData('immeuble_id', immeuble.id);
                                                                loadAppartements(immeuble.id);
                                                                setData('appartement_id', '');
                                                            }}
                                                            className={`p-4 rounded-xl border-3 text-center ${
                                                                data.immeuble_id === immeuble.id
                                                                    ? 'border-purple-600 bg-purple-50'
                                                                    : 'border-gray-300'
                                                            }`}
                                                        >
                                                            {immeuble.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Appartement */}
                                    {data.immeuble_id && (
                                        <div>
                                            <label className="block text-lg font-semibold mb-2">🏠 Appartement *</label>
                                            {loading ? (
                                                <div className="text-center py-8">Chargement...</div>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                                        {appartements.map((appartement) => (
                                                            <button
                                                                key={appartement.id}
                                                                type="button"
                                                                onClick={() => handleAppartementSelect(appartement.id)}
                                                                className={`p-4 rounded-xl border-3 text-center transition-all ${
                                                                    data.appartement_id == appartement.id
                                                                        ? 'border-orange-600 bg-orange-50 shadow-lg'
                                                                        : appartement.user_id
                                                                        ? 'border-green-300 bg-green-50 hover:border-green-400'
                                                                        : 'border-gray-300 hover:border-gray-400'
                                                                }`}
                                                            >
                                                                <div className="font-bold">N° {appartement.numero}</div>
                                                                {appartement.user_id && (
                                                                    <div className="text-xs text-green-600 mt-1">✓ Affecté</div>
                                                                )}
                                                                {!appartement.user_id && (
                                                                    <div className="text-xs text-gray-400 mt-1">Libre</div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Affichage du client sélectionné automatiquement */}
                                                    {selectedClient && data.user_id && (
                                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                                                            <div className="flex items-center">
                                                                <span className="text-2xl mr-3">👤</span>
                                                                <div>
                                                                    <div className="font-bold text-blue-800">
                                                                        Client sélectionné automatiquement :
                                                                    </div>
                                                                    <div className="text-sm text-blue-600 mt-1">
                                                                        <span className="font-semibold">{selectedClient.name}</span>
                                                                        {selectedClient.email && (
                                                                            <span className="ml-2">({selectedClient.email})</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {data.appartement_id && !data.user_id && (
                                                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
                                                            <div className="flex items-center text-yellow-800">
                                                                <span className="text-xl mr-2">⚠️</span>
                                                                <span className="font-semibold">
                                                                    Cet appartement n'est pas affecté à un client. 
                                                                    Vous devez d'abord affecter l'appartement à un client.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <InputError message={errors.user_id} className="mt-2" />
                                    <InputError message={errors.appartement_id} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 2: Titre */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">❓</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Quel est le problème ?</h3>
                                    </div>
                                    <div>
                                        <label className="block text-lg font-semibold mb-3">
                                            <span className="text-2xl mr-2">✏️</span>
                                            Titre du problème *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl"
                                            placeholder="Ex: Fissure dans le mur"
                                            required
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>
                                    {examples && examples.length > 0 && (
                                        <div className="mt-8">
                                            <div className="flex items-center mb-4">
                                                <span className="text-2xl mr-2">💡</span>
                                                <h4 className="text-lg font-bold">Ou choisissez un exemple :</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {examples.map((example) => (
                                                    <button
                                                        key={example.id}
                                                        type="button"
                                                        onClick={() => handleExampleClick(example)}
                                                        className="group relative bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-green-500 hover:shadow-lg text-left"
                                                    >
                                                        {!example.photo_path && (
                                                            <div className="text-5xl mb-2 text-center">
                                                                {example.categor?.name === 'Plomberie' ? '🔧' :
                                                                 example.categor?.name === 'Électricité' ? '⚡' :
                                                                 example.categor?.name === 'Peinture' ? '🎨' :
                                                                 example.categor?.name === 'Menuiserie' ? '🪟' :
                                                                 example.categor?.name === 'Carrelage' ? '🏺' : '📦'}
                                                            </div>
                                                        )}
                                                        <h5 className="font-bold text-gray-800 mb-1">{example.title}</h5>
                                                        {example.categor && (
                                                            <div className="text-sm text-gray-600">🏷️ {example.categor.name}</div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Étape 3: Description */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">📝</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Décrivez le problème</h3>
                                    </div>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="6"
                                        className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl"
                                        placeholder="Description détaillée..."
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 4: Catégorie */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">🏷️</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Quel type de problème ?</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {categories.map((categorie) => (
                                            <button
                                                key={categorie.id}
                                                type="button"
                                                onClick={() => setData('categor_id', categorie.id)}
                                                className={`p-6 rounded-xl border-3 text-left ${
                                                    data.categor_id === categorie.id
                                                        ? 'border-green-600 bg-green-50 shadow-lg'
                                                        : 'border-gray-300 hover:border-green-400'
                                                }`}
                                            >
                                                <h4 className="text-xl font-bold text-gray-800">{categorie.name}</h4>
                                                {categorie.description && (
                                                    <p className="text-gray-600 text-sm mt-1">{categorie.description}</p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.categor_id} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 5: Priorité et Photos */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">⚡</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Priorité et Photos</h3>
                                    </div>
                                    
                                    {/* Priorité */}
                                    <div>
                                        <label className="block text-lg font-semibold mb-3">⚡ Priorité *</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['basse', 'moyenne', 'haute'].map((priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() => setData('priority', priority)}
                                                    className={`p-4 rounded-xl border-3 text-center ${
                                                        data.priority === priority
                                                            ? priority === 'haute' ? 'border-red-600 bg-red-50'
                                                            : priority === 'moyenne' ? 'border-yellow-600 bg-yellow-50'
                                                            : 'border-green-600 bg-green-50'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    <div className="text-4xl mb-2">
                                                        {priority === 'haute' ? '🔴' : priority === 'moyenne' ? '🟡' : '🟢'}
                                                    </div>
                                                    <div className="font-bold">{priority}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Photos */}
                                    <div>
                                        <label className="block text-lg font-semibold mb-3">📸 Photos</label>
                                        <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                id="photo-upload"
                                            />
                                            <label htmlFor="photo-upload" className="cursor-pointer">
                                                <div className="text-6xl mb-4">📷</div>
                                                <p className="text-lg font-bold">Cliquez pour ajouter des photos</p>
                                            </label>
                                        </div>
                                        {previewImages.length > 0 && (
                                            <div className="grid grid-cols-4 gap-4 mt-4">
                                                {previewImages.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img src={`/${preview}`} alt={`Aperçu ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(index)}
                                                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Modal pour créer un utilisateur */}
                            <CreateUserModal
                                show={showUserModal}
                                onClose={handleCloseModal}
                                onSuccess={handleUserCreated}
                                appartementId={data.appartement_id}
                                projetId={data.projet_id}
                                secteurId={data.secteur_id}
                                immeubleId={data.immeuble_id}
                            />
                            
                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t-2">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className={`px-8 py-4 rounded-xl font-bold ${
                                        currentStep === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                    }`}
                                >
                                    ← Précédent
                                </button>
                                {currentStep < 5 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                                    >
                                        Suivant →
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing || !data.user_id}
                                        className={`px-8 py-4 rounded-xl font-bold ${
                                            processing || !data.user_id
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    >
                                        {processing ? 'Création...' : '✓ Créer'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

