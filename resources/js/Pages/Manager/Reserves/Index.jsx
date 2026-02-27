import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ reserves, categories, statuts, agents, projets }) {
    // Onglet de statut actif ("Tous" ou nom du statut) - initialisé à partir du localStorage si présent
    const [activeStatusTab, setActiveStatusTab] = useState('Tous');
console.log(reserves);

    // Filtres locaux (catégorie, priorité, agent)
    const [localFilters, setLocalFilters] = useState({
        categor_id: '',
        priority: '',
        agent_id: '',
    });

    // Gestion du scroll (nombre d'éléments affichés)
    const [itemsToShow, setItemsToShow] = useState(20);
    const loaderRef = useRef(null);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'haute': return 'bg-red-100 text-red-800 border-red-300';
            case 'moyenne': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'basse': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'haute': return '🔴';
            case 'moyenne': return '🟡';
            case 'basse': return '🟢';
            default: return '⚪';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysSinceCreation = (createdAt) => {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDaysColor = (days) => {
        if (days === 0) return 'text-green-600 bg-green-100';
        if (days <= 3) return 'text-blue-600 bg-blue-100';
        if (days <= 7) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    // Calcul des comptes par statut (en utilisant le dernier suivi de chaque réserve)
    const totalCount = reserves.length;
    const statusCounts = statuts.reduce((acc, statut) => {
        const count = reserves.filter((reserve) => {
            const suivis = Array.isArray(reserve.suivi)
                ? reserve.suivi
                : reserve.suivi
                ? [reserve.suivi]
                : [];
            if (suivis.length === 0) return false;
            const lastSuivi = suivis[suivis.length - 1];
            return lastSuivi?.statut?.name === statut.name;
        }).length;
        if (count > 0) {
            acc[statut.name] = count;
        }
        return acc;
    }, {});

    // Liste des onglets de statut (uniquement ceux qui ont au moins une réserve)
    const statusTabs = ['Tous', ...Object.keys(statusCounts)];

    // Charger le statut sélectionné depuis le localStorage au premier rendu
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedStatus = window.localStorage.getItem('manager_reserves_status_tab');
        if (storedStatus && (storedStatus === 'Tous' || statusTabs.includes(storedStatus))) {
            setActiveStatusTab(storedStatus);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sauvegarder le statut sélectionné à chaque changement
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('manager_reserves_status_tab', activeStatusTab);
    }, [activeStatusTab]);

    const getStatusTabColor = (statusName) => {
        const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all';
        const isActive = activeStatusTab === statusName;
        if (statusName === 'Tous') {
            return `${base} ${isActive ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`;
        }

        const lower = statusName.toLowerCase();
        if (lower.includes('attente') || lower.includes('pending')) {
            return `${base} ${isActive ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100'}`;
        }
        if (lower.includes('cours') || lower.includes('progress')) {
            return `${base} ${isActive ? 'bg-blue-500 text-white border-blue-600' : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'}`;
        }
        if (lower.includes('résolu') || lower.includes('resolu') || lower.includes('fermé') || lower.includes('ferme') || lower.includes('closed')) {
            return `${base} ${isActive ? 'bg-green-500 text-white border-green-600' : 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100'}`;
        }
        return `${base} ${isActive ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`;
    };

    // Appliquer les filtres côté client
    const filteredReserves = reserves.filter((reserve) => {
        // Récupérer le dernier suivi de cette réserve
        const suivis = Array.isArray(reserve.suivi)
            ? reserve.suivi
            : reserve.suivi
            ? [reserve.suivi]
            : [];
        const lastSuivi = suivis.length > 0 ? suivis[suivis.length - 1] : null;

        // Filtre par statut via onglet (en utilisant le dernier suivi)
        if (activeStatusTab !== 'Tous') {
            const currentStatus = lastSuivi?.statut?.name || '';
            if (currentStatus !== activeStatusTab) {
                return false;
            }
        }

        // Filtre par catégorie
        if (localFilters.categor_id && String(reserve.categor_id) !== String(localFilters.categor_id)) {
            return false;
        }

        // Filtre par priorité
        if (localFilters.priority && reserve.priority !== localFilters.priority) {
            return false;
        }

        // Filtre par agent
        if (localFilters.agent_id && String(reserve.agent_id) !== String(localFilters.agent_id)) {
            return false;
        }

        return true;
    });

    // Gestion du scroll infini (IntersectionObserver)
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    setItemsToShow((prev) => {
                        const next = prev + 10;
                        return next > filteredReserves.length ? filteredReserves.length : next;
                    });
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loaderRef.current);

        return () => {
            observer.disconnect();
        };
    }, [filteredReserves.length]);

    // Réinitialiser le nombre d'éléments affichés quand les filtres changent
    useEffect(() => {
        setItemsToShow(20);
    }, [activeStatusTab, localFilters.categor_id, localFilters.priority, localFilters.agent_id]);

    const clearFilters = () => {
        setActiveStatusTab('Tous');
        setLocalFilters({
            categor_id: '',
            priority: '',
            agent_id: '',
        });
        setItemsToShow(20);
    };

    const visibleReserves = filteredReserves.slice(0, itemsToShow);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Toutes les Réserves
                    </h2>
                    <Link
                        href={route('manager.reserves.create')}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg flex items-center"
                    >
                        <span className="text-xl mr-2">➕</span>
                        Créer une Réserve
                    </Link>
                </div>
            }
        >
            <Head title="Gestion des Réserves" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Onglets de statut */}
                    <div className="mb-4 bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-3 items-center">
                        <span className="text-sm font-semibold text-gray-700 mr-2">Statut :</span>
                        {statusTabs.map((statusName) => (
                            <button
                                key={statusName}
                                type="button"
                                onClick={() => setActiveStatusTab(statusName)}
                                className={getStatusTabColor(statusName)}
                            >
                                <span>{statusName === 'Tous' ? 'Tous' : statusName}</span>
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-white bg-opacity-80 text-gray-900">
                                    {statusName === 'Tous' ? totalCount : statusCounts[statusName] || 0}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Filtres */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <span className="text-xl mr-2">🔍</span>
                            Filtres
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                                <select
                                    value={localFilters.categor_id}
                                    onChange={(e) => setLocalFilters({ ...localFilters, categor_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Toutes</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priorité</label>
                                <select
                                    value={localFilters.priority}
                                    onChange={(e) => setLocalFilters({ ...localFilters, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Toutes</option>
                                    <option value="haute">Haute</option>
                                    <option value="moyenne">Moyenne</option>
                                    <option value="basse">Basse</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Agent</label>
                                <select
                                    value={localFilters.agent_id}
                                    onChange={(e) => setLocalFilters({ ...localFilters, agent_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Tous</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name} ({agent.categor?.name})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition-all"
                            >
                                Réinitialiser tous les filtres
                            </button>
                        </div>
                    </div>

                    {/* Liste des réserves */}
                    <div className="space-y-4">
                        {visibleReserves.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="text-8xl mb-6">📋</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    Aucune réserve trouvée
                                </h3>
                                <p className="text-gray-600">
                                    {activeStatusTab !== 'Tous' ||
                                    localFilters.categor_id ||
                                    localFilters.priority ||
                                    localFilters.agent_id
                                        ? 'Aucune réserve ne correspond aux filtres sélectionnés'
                                        : 'Aucune réserve pour le moment'}
                                </p>
                            </div>
                        ) : (
                            visibleReserves.map((reserve) => (
                                <div key={reserve.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-bold text-gray-800">{reserve.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getPriorityColor(reserve.priority)}`}>
                                                    {getPriorityIcon(reserve.priority)} {reserve.priority}
                                                </span>
                                                {/* Statut basé sur le dernier suivi */}
                                                {(() => {
                                                    const suivis = Array.isArray(reserve.suivi)
                                                        ? reserve.suivi
                                                        : reserve.suivi
                                                        ? [reserve.suivi]
                                                        : [];
                                                    const lastSuivi = suivis.length > 0 ? suivis[suivis.length - 1] : null;
                                                    return lastSuivi?.statut ? (
                                                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                                                            {lastSuivi.statut.name}
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>

                                            <p className="text-gray-600 mb-3">{reserve.description}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-3">
                                                <div>
                                                    <span className="text-gray-600">👤 Client:</span>
                                                    <span className="font-bold ml-2">{reserve.user?.name}</span>
                                                </div>
                                                {reserve.agent && (
                                                    <div>
                                                        <span className="text-gray-600">👷 Agent:</span>
                                                        <span className="font-bold ml-2">{reserve.agent.name}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-gray-600">🏷️ Catégorie:</span>
                                                    <span className="font-bold ml-2">{reserve.categor?.name}</span>
                                                </div>
                                                {reserve.appartement && (
                                                    <div>
                                                        <span className="text-gray-600">🏠 Appt:</span>
                                                        <span className="font-bold ml-2">N° {reserve.appartement.numero}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Date de création et nombre de jours */}
                                            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-200">
                                                <div className="flex items-center">
                                                    <span className="text-gray-600 mr-2">📅</span>
                                                    <span className="text-sm text-gray-700">
                                                        <span className="font-semibold">Créée le:</span>
                                                        <span className="ml-2 font-bold text-gray-900">
                                                            {formatDate(reserve.created_at)}
                                                        </span>
                                                    </span>
                                                </div>
                                                {(() => {
                                                    const daysSince = getDaysSinceCreation(reserve.created_at);
                                                    return (
                                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDaysColor(daysSince)}`}>
                                                            <span className="text-base mr-1">⏱️</span>
                                                            {daysSince === 0 
                                                                ? "Aujourd'hui" 
                                                                : daysSince === 1 
                                                                ? "1 jour" 
                                                                : `${daysSince} jours`
                                                            }
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="ml-4 flex gap-2">
                                            <Link
                                                href={route('manager.reserves.show', reserve.id)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                                            >
                                                Voir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {/* Loader pour le scroll infini */}
                        {visibleReserves.length < filteredReserves.length && (
                            <div ref={loaderRef} className="flex justify-center mt-6 pb-4 text-gray-500 text-sm">
                                Défilez pour charger plus de réserves...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

