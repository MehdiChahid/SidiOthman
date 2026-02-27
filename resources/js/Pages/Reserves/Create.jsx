import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import StepIndicator from '@/Components/StepIndicator';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ categories, userInfo, examples }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [previewImages, setPreviewImages] = useState([]);
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        categor_id: '',
        priority: 'moyenne',
        photos: [],
    });

    const steps = [
        {
            icon: '❓',
            title: 'Problème',
            description: 'Quel est le problème ?'
        },
        {
            icon: '📝',
            title: 'Description',
            description: 'Décrivez le problème en détail'
        },
        {
            icon: '🏷️',
            title: 'Type',
            description: 'Quel type de problème ?'
        },
        {
            icon: '⚡',
            title: 'Urgence',
            description: 'Quelle est l\'urgence ?'
        },
        {
            icon: '📸',
            title: 'Photos',
            description: 'Ajoutez des photos du problème'
        }
    ];

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);

        // Créer les aperçus
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
        // Remplir automatiquement les champs avec l'exemple
        setData('title', example.title);
        setData('description', example.description || '');
        setData('categor_id', example.categor_id);
        setData('priority', example.priority);
        
        // Passer directement à l'étape 5 (photos) car tout est déjà rempli
        // L'utilisateur peut toujours revenir en arrière pour modifier
        setCurrentStep(5);
    };

    const handleNext = () => {
        // Validation pour chaque étape
        if (currentStep === 1 && !data.title) {
            return;
        }
        if (currentStep === 3 && !data.categor_id) {
            return;
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

    const submit = (e) => {
        e.preventDefault();
        post(route('reserves.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Créer une Nouvelle Réserve
                    </h2>
                    <Link
                        href={route('reserves.index')}
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
                    {/* Informations de l'appartement */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <span className="text-2xl mr-2">🏠</span>
                            Votre Appartement
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {userInfo.projet && (
                                <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                                    <p className="text-gray-600 mb-1">Projet</p>
                                    <p className="font-bold text-gray-800">{userInfo.projet.name}</p>
                                </div>
                            )}
                            {userInfo.secteur && (
                                <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                                    <p className="text-gray-600 mb-1">Secteur</p>
                                    <p className="font-bold text-gray-800">{userInfo.secteur.name}</p>
                                </div>
                            )}
                            {userInfo.immeuble && (
                                <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
                                    <p className="text-gray-600 mb-1">Immeuble</p>
                                    <p className="font-bold text-gray-800">{userInfo.immeuble.name}</p>
                                </div>
                            )}
                            {userInfo.appartement && (
                                <div className="bg-orange-50 p-3 rounded-lg border-2 border-orange-200">
                                    <p className="text-gray-600 mb-1">Appartement</p>
                                    <p className="font-bold text-gray-800">N° {userInfo.appartement.numero} - Étage {userInfo.appartement.etage}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Indicateur d'étapes */}
                    <StepIndicator currentStep={currentStep} totalSteps={5} steps={steps} />

                    {/* Formulaire */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <form onSubmit={submit} className="p-8">
                            {/* Étape 1: Titre */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">❓</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Quel est le problème ?</h3>
                                        <p className="text-gray-600 mt-2">Donnez un titre court et clair</p>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                                            <span className="text-2xl mr-2">✏️</span>
                                            Titre du problème *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            placeholder="Ex: Fissure dans le mur du salon"
                                            required
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                        <p className="text-sm text-gray-500 mt-2">
                                            💡 Astuce : Soyez précis, par exemple "Fuite d'eau dans la salle de bain"
                                        </p>
                                    </div>

                                    {/* Exemples de problèmes */}
                                    {examples && examples.length > 0 && (
                                        <div className="mt-8">
                                            <div className="flex items-center mb-4">
                                                <span className="text-2xl mr-2">💡</span>
                                                <h4 className="text-lg font-bold text-gray-800">Ou choisissez un exemple rapide :</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {examples.map((example) => (
                                                    <button
                                                        key={example.id}
                                                        type="button"
                                                        onClick={() => handleExampleClick(example)}
                                                        className="group relative bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105 text-left"
                                                    >
                                                        {/* Photo de l'exemple */}
                                                        {example.photo_path && (
                                                            <div className="mb-3 overflow-hidden rounded-lg">
                                                                <img
                                                                    src={`/images/examples/${example.photo_path}`}
                                                                    alt={example.title}
                                                                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Icône si pas de photo */}
                                                        {!example.photo_path && (
                                                            <div className="mb-3 text-center">
                                                                <div className="text-5xl">
                                                                    {example.categor?.name === 'Plomberie' ? '🔧' :
                                                                     example.categor?.name === 'Électricité' ? '⚡' :
                                                                     example.categor?.name === 'Peinture' ? '🎨' :
                                                                     example.categor?.name === 'Menuiserie' ? '🪟' :
                                                                     example.categor?.name === 'Carrelage' ? '🏺' : '📦'}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Titre */}
                                                        <h5 className="font-bold text-gray-800 mb-2 text-lg">
                                                            {example.title}
                                                        </h5>

                                                        {/* Catégorie */}
                                                        {example.categor && (
                                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                                <span className="mr-1">🏷️</span>
                                                                <span>{example.categor.name}</span>
                                                            </div>
                                                        )}

                                                        {/* Priorité */}
                                                        <div className="flex items-center text-sm">
                                                            {example.priority === 'haute' && (
                                                                <span className="text-red-600 font-bold">🔴 Urgent</span>
                                                            )}
                                                            {example.priority === 'moyenne' && (
                                                                <span className="text-yellow-600 font-bold">🟡 Moyenne</span>
                                                            )}
                                                            {example.priority === 'basse' && (
                                                                <span className="text-green-600 font-bold">🟢 Basse</span>
                                                            )}
                                                        </div>

                                                        {/* Indicateur de clic rapide */}
                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="bg-green-500 text-white rounded-full p-2">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-4 text-center">
                                                ⚡ Cliquez sur un exemple pour remplir automatiquement tous les champs et accélérer la création
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Étape 2: Description */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">📝</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Décrivez le problème</h3>
                                        <p className="text-gray-600 mt-2">Donnez plus de détails pour mieux comprendre</p>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                                            <span className="text-2xl mr-2">📄</span>
                                            Description détaillée
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="6"
                                            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                                            placeholder="Décrivez le problème en détail... Où se trouve-t-il ? Depuis quand ? Quelles sont les conséquences ?"
                                        ></textarea>
                                        <InputError message={errors.description} className="mt-2" />
                                        <p className="text-sm text-gray-500 mt-2">
                                            💡 Astuce : Plus vous donnez de détails, plus nous pourrons vous aider rapidement
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Étape 3: Catégorie */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">🏷️</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Quel type de problème ?</h3>
                                        <p className="text-gray-600 mt-2">Choisissez la catégorie qui correspond le mieux</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {categories.map((categorie) => (
                                            <button
                                                key={categorie.id}
                                                type="button"
                                                onClick={() => setData('categor_id', categorie.id)}
                                                className={`
                                                    p-6 rounded-xl border-3 text-left transition-all transform hover:scale-105
                                                    ${data.categor_id === categorie.id
                                                        ? 'border-green-600 bg-green-50 shadow-lg'
                                                        : 'border-gray-300 hover:border-green-400 hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-start">
                                                    <div className="text-4xl mr-4">{categorie.name === 'Plomberie' ? '🔧' : categorie.name === 'Électricité' ? '⚡' : categorie.name === 'Peinture' ? '🎨' : categorie.name === 'Menuiserie' ? '🪟' : categorie.name === 'Carrelage' ? '🏺' : '📦'}</div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xl font-bold text-gray-800">{categorie.name}</h4>
                                                        {categorie.description && (
                                                            <p className="text-gray-600 text-sm mt-2">{categorie.description}</p>
                                                        )}
                                                    </div>
                                                    {data.categor_id === categorie.id && (
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
                                    <InputError message={errors.categor_id} className="mt-2" />
                                </div>
                            )}

                            {/* Étape 4: Priorité */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">⚡</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Quelle est l'urgence ?</h3>
                                        <p className="text-gray-600 mt-2">Indiquez à quel point c'est urgent</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <button
                                            type="button"
                                            onClick={() => setData('priority', 'basse')}
                                            className={`
                                                p-6 rounded-xl border-3 text-center transition-all transform hover:scale-105
                                                ${data.priority === 'basse'
                                                    ? 'border-green-600 bg-green-50 shadow-lg'
                                                    : 'border-gray-300 hover:border-green-400 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <div className="text-6xl mb-3">🟢</div>
                                            <div className="text-xl font-bold text-gray-800 mb-2">Basse</div>
                                            <div className="text-sm text-gray-600">Pas urgent</div>
                                            <div className="text-xs text-gray-500 mt-2">Problème esthétique</div>
                                            {data.priority === 'basse' && (
                                                <div className="mt-3 text-green-600">
                                                    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('priority', 'moyenne')}
                                            className={`
                                                p-6 rounded-xl border-3 text-center transition-all transform hover:scale-105
                                                ${data.priority === 'moyenne'
                                                    ? 'border-yellow-600 bg-yellow-50 shadow-lg'
                                                    : 'border-gray-300 hover:border-yellow-400 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <div className="text-6xl mb-3">🟡</div>
                                            <div className="text-xl font-bold text-gray-800 mb-2">Moyenne</div>
                                            <div className="text-sm text-gray-600">À traiter</div>
                                            <div className="text-xs text-gray-500 mt-2">Gêne quotidienne</div>
                                            {data.priority === 'moyenne' && (
                                                <div className="mt-3 text-yellow-600">
                                                    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('priority', 'haute')}
                                            className={`
                                                p-6 rounded-xl border-3 text-center transition-all transform hover:scale-105
                                                ${data.priority === 'haute'
                                                    ? 'border-red-600 bg-red-50 shadow-lg'
                                                    : 'border-gray-300 hover:border-red-400 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <div className="text-6xl mb-3">🔴</div>
                                            <div className="text-xl font-bold text-gray-800 mb-2">Haute</div>
                                            <div className="text-sm text-gray-600">Urgent</div>
                                            <div className="text-xs text-gray-500 mt-2">Dangereux ou bloquant</div>
                                            {data.priority === 'haute' && (
                                                <div className="mt-3 text-red-600">
                                                    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.priority} className="mt-2" />
                                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            <span className="font-bold">💡 Exemples :</span><br/>
                                            🔴 <strong>Haute</strong> : Fuite d'eau importante, problème électrique dangereux<br/>
                                            🟡 <strong>Moyenne</strong> : Porte qui ne ferme pas, peinture écaillée<br/>
                                            🟢 <strong>Basse</strong> : Petite fissure, carrelage légèrement décalé
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Étape 5: Photos */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-4">📸</div>
                                        <h3 className="text-2xl font-bold text-gray-800">Ajoutez des photos</h3>
                                        <p className="text-gray-600 mt-2">Les photos aident à mieux comprendre le problème</p>
                                    </div>

                                    <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-all bg-gray-50">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="cursor-pointer"
                                        >
                                            <div className="text-8xl mb-6">📷</div>
                                            <p className="text-xl font-bold text-gray-800 mb-3">
                                                Cliquez pour ajouter des photos
                                            </p>
                                            <p className="text-gray-600 mb-4">
                                                Vous pouvez sélectionner plusieurs photos à la fois
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Formats acceptés : JPEG, PNG, GIF • Taille max : 10MB par photo
                                            </p>
                                        </label>
                                    </div>
                                    <InputError message={errors.photos} className="mt-2" />

                                    {/* Aperçu des photos */}
                                    {previewImages.length > 0 && (
                                        <div className="mt-6">
                                            <p className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                                <span className="text-2xl mr-2">✅</span>
                                                {previewImages.length} photo{previewImages.length > 1 ? 's' : ''} sélectionnée{previewImages.length > 1 ? 's' : ''}
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {previewImages.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={`/${preview}`}
                                                            alt={`Aperçu ${index + 1}`}
                                                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 hover:border-green-500 transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(index)}
                                                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-lg"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {previewImages.length === 0 && (
                                        <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                                            <p className="text-sm text-yellow-800">
                                                <span className="font-bold">💡 Astuce :</span> Les photos ne sont pas obligatoires, mais elles nous aident beaucoup à comprendre et résoudre votre problème plus rapidement !
                                            </p>
                                        </div>
                                    )}
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
                                            (currentStep === 1 && !data.title) ||
                                            (currentStep === 3 && !data.categor_id)
                                        }
                                        className={`
                                            px-8 py-4 rounded-xl font-bold text-lg transition-all transform
                                            ${(currentStep === 1 && !data.title) ||
                                              (currentStep === 3 && !data.categor_id)
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 hover:scale-105 shadow-lg'
                                            }
                                        `}
                                    >
                                        Suivant →
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <Link
                                            href={route('reserves.index')}
                                            className="px-6 py-4 bg-gray-300 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-400 transition-all"
                                        >
                                            Annuler
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.title || !data.categor_id}
                                            className={`
                                                px-8 py-4 rounded-xl font-bold text-lg transition-all transform
                                                ${processing || !data.title || !data.categor_id
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 hover:scale-105 shadow-lg'
                                                }
                                            `}
                                        >
                                            {processing ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Création...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <span className="text-2xl mr-2">✅</span>
                                                    Terminer et créer
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                )}
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
        </AuthenticatedLayout>
    );
}

