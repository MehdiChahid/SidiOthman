import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ agent, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: agent.name || '',
        email: agent.email || '',
        phone: agent.phone || '',
        password: '',
        password_confirmation: '',
        categor_id: agent.categor_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('manager.agents.update', agent.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Modifier l'Agent
                    </h2>
                    <Link
                        href={route('manager.agents.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        ← Retour
                    </Link>
                </div>
            }
        >
            <Head title="Modifier l'Agent" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">👷</div>
                            <h1 className="text-3xl font-bold text-gray-800">Modifier l'Agent</h1>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-lg font-semibold mb-2">👤 Nom complet *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2">📧 Email *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2">📱 Téléphone</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2">🔧 Spécialité (Métier) *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categories.map((categorie) => (
                                        <button
                                            key={categorie.id}
                                            type="button"
                                            onClick={() => setData('categor_id', categorie.id)}
                                            className={`p-4 rounded-xl border-3 text-left ${
                                                data.categor_id == categorie.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        >
                                            <div className="font-bold">{categorie.name}</div>
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.categor_id} />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2">🔒 Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                                    placeholder="Laisser vide pour ne pas changer"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2">🔒 Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Link
                                    href={route('manager.agents.index')}
                                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-bold text-center"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || !data.name || !data.email || !data.categor_id}
                                    className={`flex-1 px-6 py-3 rounded-xl font-bold ${
                                        processing || !data.name || !data.email || !data.categor_id
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    {processing ? 'Modification...' : '✓ Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

