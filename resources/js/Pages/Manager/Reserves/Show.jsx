import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ reserve, agents, statuts }) {
    const ValidateReserve = (statut_id) => {
        post(route('manager.reserves.validate', reserve.id));
    };
    const [action, setAction] = useState(''); // 'valider' ou 'rejeter'

    console.log(reserve);

    // Normaliser les suivis (le backend renvoie maintenant un tableau)
    const suivis = Array.isArray(reserve.suivi)
        ? reserve.suivi
        : reserve.suivi
            ? [reserve.suivi]
            : [];

    // Dernier suivi (statut actuel)
    const lastSuivi = suivis.length > 0 ? suivis[suivis.length - 1] : null;

    const [showHistory, setShowHistory] = useState(false);
    // Trouver les IDs des statuts "validé" et "rejeté"
    const { validatedStatusId, rejectedStatusId } = useMemo(() => {
        const lowerIncludes = (name, needles) =>
            needles.some((n) => name.toLowerCase().includes(n));

        let validatedId = null;
        let rejectedId = null;

        statuts.forEach((statut) => {
            const n = statut.name.toLowerCase();
            if (!validatedId && lowerIncludes(n, ['valid', 'approuv'])) {
                validatedId = statut.id;
            }
            if (!rejectedId && lowerIncludes(n, ['rejet', 'refus'])) {
                rejectedId = statut.id;
            }
        });

        return {
            validatedStatusId: validatedId,
            rejectedStatusId: rejectedId,
        };
    }, [statuts]);

    const { data, setData, post, processing, errors } = useForm({
        agent_id: reserve.agent_id || '',
        statut_id: lastSuivi?.statut_id || '',
        description: '',
        action: '',
    });

    const handleValidateAndAssign = (e) => {
        e.preventDefault();

    
        post(route('manager.reserves.assign', reserve.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Détails de la Réserve
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
            <Head title={`Réserve: ${reserve.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                            <h1 className="text-3xl font-bold mb-3">{reserve.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-bold">
                                    {reserve.priority}
                                </span>
                                {lastSuivi?.statut && (
                                    <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-bold">
                                        {lastSuivi.statut.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Informations */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">📋 Informations</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-gray-600">👤 Client:</span> <span className="font-bold">{reserve.user?.name}</span></div>
                                    <div><span className="text-gray-600">🏷️ Catégorie:</span> <span className="font-bold">{reserve.categor?.name}</span></div>
                                    {reserve.appartement && (
                                        <div><span className="text-gray-600">🏠 Appartement:</span> <span className="font-bold">N° {reserve.appartement.numero}</span></div>
                                    )}
                                    {reserve.agent && (
                                        <div><span className="text-gray-600">👷 Agent assigné:</span> <span className="font-bold">{reserve.agent.name}</span></div>
                                    )}
                                </div>
                            </div>

                            {/* Photos */}
                            {reserve.fichie?.fichierdetails && reserve.fichie.fichierdetails.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">📸 Photos</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {reserve.fichie.fichierdetails.map((photo) => (
                                            <img
                                                key={photo.id}
                                                src={`/${photo.chemin_complet}`}
                                                alt={photo.nom_fichier}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bouton pour afficher l'historique des suivis */}
                            {suivis.length > 1 && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Historique des statuts</h3>
                                        <p className="text-sm text-gray-600">
                                            {suivis.length} entrées de suivi au total.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowHistory(true)}
                                        className="px-4 py-2 rounded-xl font-bold text-sm bg-white border border-gray-300 hover:bg-gray-100 transition-all"
                                    >
                                        Voir l’historique
                                    </button>
                                </div>
                            )}

                            {/* Validation et Affectation / Rejet */}
                            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                                <h3 className="text-xl font-bold mb-4">Traitement de la Réserve</h3>

                                {/* Choix d'action */}
                                <div className="flex flex-wrap gap-3 mb-6">

                                    {lastSuivi.statut.id == 1 && (lastSuivi.statut.id == 2 ?
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAction('rejeter');
                                                setData('action', 'rejeter');
                                                if (rejectedStatusId) {
                                                    setData('statut_id', rejectedStatusId);
                                                }
                                                setData('agent_id', '');
                                            }}
                                            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${action === 'rejeter'
                                                    ? 'bg-red-600 text-white shadow-lg'
                                                    : 'bg-white text-red-700 border-2 border-red-300 hover:bg-red-50'
                                                }`}
                                        >
                                            <span>⛔</span>
                                            <span>Rejeter la Réserve</span>
                                        </button> :
                                        <button
                                            type="button"
                                            onClick={() => {
                                                ValidateReserve(2);
                                            }}
                                            className="px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 bg-white text-green-700 border-2 border-green-300 hover:bg-green-50"
                                        >
                                            <span>✅</span>
                                            <span>Valider la Réserve</span>
                                        </button>)
                                    }
                                </div>

                                {(lastSuivi.statut.id == 1 && lastSuivi.statut.id == 2 )&& (
                                    <p className="text-sm text-gray-600 mb-4">
                                        Choisissez <span className="font-semibold">Valider</span> ou <span className="font-semibold">Rejeter</span> la réserve, puis ajoutez un commentaire.
                                    </p>
                                )}

                                <form onSubmit={handleValidateAndAssign}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block font-semibold mb-2">
                                                Description / Commentaire {action ? '(obligatoire)' : ''}
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                placeholder={
                                                    action === 'valider'
                                                        ? "Ex: Réserve acceptée, intervention planifiée..."
                                                        : action === 'rejeter'
                                                            ? "Ex: Réserve rejetée, motif..."
                                                            : "Commentaire sur la décision..."
                                                }
                                            ></textarea>
                                            <InputError message={errors.description} />
                                        </div>

                                        {/* Liste des techniciens uniquement si on valide */}
                                        {lastSuivi.statut.id==2 && (
                                            <div>
                                                <label className="block font-semibold mb-2">
                                                    Affecter à un technicien (obligatoire)
                                                </label>
                                                <select
                                                    value={data.agent_id}
                                                    onChange={(e) => setData('agent_id', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">Sélectionner un technicien</option>
                                                    {agents.map(agent => (
                                                        <option key={agent.id} value={agent.id}>
                                                            {agent.name} ({agent.categor?.name})
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.agent_id} />
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Seuls les techniciens de la même catégorie que la réserve sont proposés.
                                                </p>
                                            </div>
                                        )}

                                       
                                    </div>
                                    {lastSuivi.statut.id==2 && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700"
                                    >
                                        {processing ? 'Traitement...' : '✓ Affecter la Réserve'}
                                    </button>
                                    )}
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Historique des suivis */}
            {showHistory && suivis.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span>📜</span>
                                    Historique des statuts
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {suivis.length} entrées au total, la plus récente en haut.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowHistory(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-3">
                            {suivis
                                .slice()
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((suivi, index) => (
                                    <div
                                        key={suivi.id || index}
                                        className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                                    >
                                        <div className="mt-1 text-xl">
                                            {index === 0 ? '⭐' : '⬤'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-gray-800">
                                                    {suivi.statut?.name || 'Statut'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {suivi.date
                                                        ? new Date(suivi.date).toLocaleString('fr-FR')
                                                        : ''}
                                                </span>
                                            </div>
                                            {suivi.description && (
                                                <p className="text-sm text-gray-700">
                                                    {suivi.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowHistory(false)}
                                className="px-4 py-2 rounded-xl font-bold text-sm bg-gray-700 text-white hover:bg-gray-800 transition-all"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

