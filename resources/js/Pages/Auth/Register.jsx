import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import StepIndicator from '@/Components/StepIndicator';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const [projets, setProjets] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [immeubles, setImmeubles] = useState([]);
    const [appartements, setAppartements] = useState([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        projet_id: '',
        secteur_id: '',
        immeuble_id: '',
        appartement_id: '',
    });

    const steps = [
        {
            icon: '👤',
            title: 'Informations',
            description: 'Entrez vos informations personnelles'
        },
        {
            icon: '🏗️',
            title: 'Projet',
            description: 'Choisissez votre projet'
        },
        {
            icon: '📍',
            title: 'Secteur',
            description: 'Sélectionnez le secteur'
        },
        {
            icon: '🏢',
            title: 'Immeuble',
            description: 'Choisissez votre immeuble'
        },
        {
            icon: '🏠',
            title: 'Appartement',
            description: 'Sélectionnez votre appartement'
        }
    ];

    // Charger les projets au montage
    useEffect(() => {
        if (currentStep === 2) {
            loadProjets();
        }
    }, [currentStep]);

    const loadProjets = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/registration/projets');
            setProjets(response.data);
        } catch (error) {
            console.error('Erreur chargement projets:', error);
        } finally {
            setLoading(false);
        }
    };

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
            const response = await axios.get('/api/registration/appartements', {
                params: { immeuble_id: immeubleId }
            });
            setAppartements(response.data);
        } catch (error) {
            console.error('Erreur chargement appartements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        // Validation pour chaque étape
        if (currentStep === 1) {
            if (!data.name || !data.email || !data.password || !data.password_confirmation) {
                return;
            }
        }
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleProjetSelect = (projetId) => {
        setData('projet_id', projetId);
        loadSecteurs(projetId);
        // Reset les étapes suivantes
        setData('secteur_id', '');
        setData('immeuble_id', '');
        setData('appartement_id', '');
        setSecteurs([]);
        setImmeubles([]);
        setAppartements([]);
        // Passer automatiquement à l'étape suivante (Secteur)
        setCurrentStep(3);
    };

    const handleSecteurSelect = (secteurId) => {
        setData('secteur_id', secteurId);
        loadImmeubles(secteurId);
        // Reset les étapes suivantes
        setData('immeuble_id', '');
        setData('appartement_id', '');
        setImmeubles([]);
        setAppartements([]);
        // Passer automatiquement à l'étape suivante (Immeuble)
        setCurrentStep(4);
    };

    const handleImmeubleSelect = (immeubleId) => {
        setData('immeuble_id', immeubleId);
        loadAppartements(immeubleId);
        // Reset l'appartement
        setData('appartement_id', '');
        setAppartements([]);
        // Passer automatiquement à l'étape suivante (Appartement)
        setCurrentStep(5);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <StepIndicator currentStep={currentStep} totalSteps={5} steps={steps} />

                    <div className="bg-white rounded-2xl shadow-2xl p-8 mt-8">
            <form onSubmit={submit}>
                            {/* Étape 1: Informations personnelles */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">👤</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Vos informations</h3>
                                        <p className="text-gray-600 mt-2">Commençons par vos informations de base</p>
                                    </div>

                                    <div className="space-y-4">
                <div>
                                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                                📝 Nom complet
                                            </label>
                                            <input
                                                type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                placeholder="Ex: Ahmed Mohamed"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                                        <div>
                                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                                📧 Email
                                            </label>
                                            <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                                                className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                placeholder="Ex: ahmed@email.com"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                                        <div>
                                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                                🔒 Mot de passe
                                            </label>
                                            <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                                                className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                                        <div>
                                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                                🔒 Confirmer le mot de passe
                                            </label>
                                            <input
                        type="password"
                        value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                placeholder="••••••••"
                        required
                    />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Étape 2: Choix du projet */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">🏗️</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Choisissez votre projet</h3>
                                        <p className="text-gray-600 mt-2">Sélectionnez le projet immobilier</p>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                                            <p className="mt-4 text-gray-600 text-lg">Chargement des projets...</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {projets.map((projet) => (
                                                <button
                                                    key={projet.id}
                                                    type="button"
                                                    onClick={() => handleProjetSelect(projet.id)}
                                                    className={`
                                                        p-6 rounded-xl border-3 text-left transition-all transform hover:scale-105
                                                        ${data.projet_id === projet.id
                                                            ? 'border-blue-600 bg-blue-50 shadow-lg'
                                                            : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="text-4xl mr-4">🏗️</div>
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-bold text-gray-800">{projet.name}</h4>
                                                            {projet.description && (
                                                                <p className="text-gray-600 mt-2">{projet.description}</p>
                                                            )}
                                                            {projet.location && (
                                                                <p className="text-gray-500 mt-1 flex items-center">
                                                                    <span className="mr-1">📍</span>
                                                                    {projet.location}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {data.projet_id === projet.id && (
                                                            <div className="ml-2 text-blue-600">
                                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.projet_id} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 3: Choix du secteur */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">📍</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Choisissez votre secteur</h3>
                                        <p className="text-gray-600 mt-2">Sélectionnez le secteur dans le projet</p>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                                            <p className="mt-4 text-gray-600 text-lg">Chargement des secteurs...</p>
                                        </div>
                                    ) : secteurs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">😕</div>
                                            <p className="text-gray-600 text-lg">Aucun secteur disponible pour ce projet</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {secteurs.map((secteur) => (
                                                <button
                                                    key={secteur.id}
                                                    type="button"
                                                    onClick={() => handleSecteurSelect(secteur.id)}
                                                    className={`
                                                        p-6 rounded-xl border-3 text-left transition-all transform hover:scale-105
                                                        ${data.secteur_id === secteur.id
                                                            ? 'border-green-600 bg-green-50 shadow-lg'
                                                            : 'border-gray-300 hover:border-green-400 hover:shadow-md'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="text-4xl mr-4">📍</div>
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-bold text-gray-800">{secteur.name}</h4>
                                                            {secteur.description && (
                                                                <p className="text-gray-600 mt-2">{secteur.description}</p>
                                                            )}
                                                        </div>
                                                        {data.secteur_id === secteur.id && (
                                                            <div className="ml-2 text-green-600">
                                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.secteur_id} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 4: Choix de l'immeuble */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">🏢</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Choisissez votre immeuble</h3>
                                        <p className="text-gray-600 mt-2">Sélectionnez l'immeuble dans le secteur</p>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                                            <p className="mt-4 text-gray-600 text-lg">Chargement des immeubles...</p>
                                        </div>
                                    ) : immeubles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">😕</div>
                                            <p className="text-gray-600 text-lg">Aucun immeuble disponible pour ce secteur</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {immeubles.map((immeuble) => (
                                                <button
                                                    key={immeuble.id}
                                                    type="button"
                                                    onClick={() => handleImmeubleSelect(immeuble.id)}
                                                    className={`
                                                        p-6 rounded-xl border-3 text-center transition-all transform hover:scale-105
                                                        ${data.immeuble_id === immeuble.id
                                                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                                                            : 'border-gray-300 hover:border-purple-400 hover:shadow-md'
                                                        }
                                                    `}
                                                >
                                                    <div className="text-5xl mb-3">🏢</div>
                                                    <h4 className="text-xl font-bold text-gray-800">{immeuble.name}</h4>
                                                    {data.immeuble_id === immeuble.id && (
                                                        <div className="mt-2 text-purple-600">
                                                            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.immeuble_id} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 5: Choix de l'appartement */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">🏠</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Choisissez votre appartement</h3>
                                        <p className="text-gray-600 mt-2">Sélectionnez votre appartement</p>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                                            <p className="mt-4 text-gray-600 text-lg">Chargement des appartements...</p>
                                        </div>
                                    ) : appartements.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">😕</div>
                                            <p className="text-gray-600 text-lg">Aucun appartement disponible pour cet immeuble</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {appartements.map((appartement) => (
                                                <button
                                                    key={appartement.id}
                                                    type="button"
                                                    onClick={() => setData('appartement_id', appartement.id)}
                                                    className={`
                                                        p-6 rounded-xl border-3 text-center transition-all transform hover:scale-105
                                                        ${data.appartement_id === appartement.id
                                                            ? 'border-orange-600 bg-orange-50 shadow-lg'
                                                            : 'border-gray-300 hover:border-orange-400 hover:shadow-md'
                                                        }
                                                    `}
                                                >
                                                    <div className="text-4xl mb-2">🏠</div>
                                                    <h4 className="text-lg font-bold text-gray-800">N° {appartement.numero}</h4>
                                                    <p className="text-gray-600 text-sm mt-1">Étage {appartement.etage}</p>
                                                    {data.appartement_id === appartement.id && (
                                                        <div className="mt-2 text-orange-600">
                                                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.appartement_id} className="mt-2" />
                                </div>
                            )}

                            {/* Boutons de navigation */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className={`
                                        px-8 py-4 rounded-xl font-bold text-lg transition-all transform
                                        ${currentStep === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-600 text-white hover:bg-gray-700 hover:scale-105 shadow-lg'
                                        }
                                    `}
                                >
                                    ← Précédent
                                </button>

                                {currentStep < 5 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={
                                            (currentStep === 1 && (!data.name || !data.email || !data.password || !data.password_confirmation)) ||
                                            (currentStep === 2 && !data.projet_id) ||
                                            (currentStep === 3 && !data.secteur_id) ||
                                            (currentStep === 4 && !data.immeuble_id)
                                        }
                                        className={`
                                            px-8 py-4 rounded-xl font-bold text-lg transition-all transform
                                            ${(currentStep === 1 && (!data.name || !data.email || !data.password || !data.password_confirmation)) ||
                                              (currentStep === 2 && !data.projet_id) ||
                                              (currentStep === 3 && !data.secteur_id) ||
                                              (currentStep === 4 && !data.immeuble_id)
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 hover:scale-105 shadow-lg'
                                            }
                                        `}
                                    >
                                        Suivant →
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing || !data.appartement_id}
                                        className={`
                                            px-8 py-4 rounded-xl font-bold text-lg transition-all transform
                                            ${processing || !data.appartement_id
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 hover:scale-105 shadow-lg'
                                            }
                                        `}
                                    >
                                        {processing ? 'Inscription...' : '✓ Terminer l\'inscription'}
                                    </button>
                                )}
                </div>

                            {/* Lien de connexion */}
                            <div className="text-center mt-6">
                    <Link
                        href={route('login')}
                                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline"
                    >
                                    Vous avez déjà un compte ? Connectez-vous
                    </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
        </GuestLayout>
    );
}
