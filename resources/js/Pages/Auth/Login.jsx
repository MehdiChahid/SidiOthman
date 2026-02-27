import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 sm:space-y-8">
                    {/* En-tête avec logo et titre */}
                    <div className="text-center animate-fadeIn">
                        <div className="text-7xl sm:text-8xl mb-4 animate-bounce-slow">🏠</div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                            Bienvenue !
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600">
                            Connectez-vous à votre espace de gestion
                        </p>
                    </div>

                    {/* Carte principale */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                        {/* En-tête de la carte */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 sm:px-8 py-5 sm:py-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                                <span className="text-2xl sm:text-3xl mr-3">🔐</span>
                                Connexion
                            </h3>
                        </div>

                        <div className="px-6 sm:px-8 py-6 sm:py-8">
                            {status && (
                                <div className="mb-6 p-4 bg-green-100 border-2 border-green-400 rounded-xl text-green-800 font-semibold text-center">
                                    <span className="text-xl mr-2">✅</span>
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                                        <span className="text-xl sm:text-2xl mr-2">📧</span>
                                        Adresse Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="votre@email.com"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Mot de passe */}
                                <div>
                                    <label htmlFor="password" className="block text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                                        <span className="text-xl sm:text-2xl mr-2">🔒</span>
                                        Mot de passe
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Se souvenir de moi */}
                                <div className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <label className="ms-3 text-base text-gray-700 font-medium cursor-pointer">
                                        Se souvenir de moi
                                    </label>
                                </div>

                                {/* Mot de passe oublié */}
                                {canResetPassword && (
                                    <div className="text-center">
                                        <Link
                                            href={route('password.request')}
                                            className="text-blue-600 hover:text-blue-800 font-semibold text-base underline"
                                        >
                                            <span className="text-lg mr-1">🔑</span>
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                )}

                                {/* Bouton de connexion */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`
                                        w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg
                                        ${processing
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                        }
                                    `}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Connexion en cours...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <span className="text-xl sm:text-2xl mr-2">🚀</span>
                                            Se connecter
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Séparateur */}
                            <div className="mt-6 sm:mt-8 mb-4 sm:mb-6 relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-600 font-semibold">OU</span>
                                </div>
                            </div>

                            {/* Bouton d'inscription */}
                            <Link
                                href={route('register')}
                                className="block w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-base sm:text-lg text-center transition-all transform hover:scale-105 shadow-lg bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800"
                            >
                                <span className="flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl mr-2">✨</span>
                                    Créer un compte
                                </span>
                            </Link>

                            {/* Texte d'aide */}
                            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
                                <span className="text-base sm:text-lg mr-1">💡</span>
                                Vous n'avez pas encore de compte ? Créez-en un en quelques étapes simples !
                            </p>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600">
                            <span className="text-base sm:text-lg mr-1">🛡️</span>
                            Sécurisé et facile à utiliser
                        </p>
                    </div>
                </div>
            </div>

            {/* Animations CSS */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.6s ease-out;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </GuestLayout>
    );
}
