import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ reserves, statuts, categories }) {
    // Onglet de statut actif ("Tous" ou nom du statut) - initialisé à partir du localStorage si présent
    const [activeStatusTab, setActiveStatusTab] = useState('Tous');
    
    // Filtres locaux (catégorie, priorité)
    const [localFilters, setLocalFilters] = useState({
        categor_id: '',
        priority: '',
    });

    // Gestion du scroll (nombre d'éléments affichés)
    const [itemsToShow, setItemsToShow] = useState(20);
    const loaderRef = useRef(null);

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
        const storedStatus = window.localStorage.getItem('agent_reserves_status_tab');
        if (storedStatus && (storedStatus === 'Tous' || statusTabs.includes(storedStatus))) {
            setActiveStatusTab(storedStatus);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sauvegarder le statut sélectionné à chaque changement
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('agent_reserves_status_tab', activeStatusTab);
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
    }, [activeStatusTab, localFilters.categor_id, localFilters.priority]);

    const clearFilters = () => {
        setActiveStatusTab('Tous');
        setLocalFilters({
            categor_id: '',
            priority: '',
        });
        setItemsToShow(20);
    };

    const visibleReserves = filteredReserves.slice(0, itemsToShow);

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

    const getDaysSinceCreation = (createdAt) => {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDaysColor = (createdAt) => {
        const days = getDaysSinceCreation(createdAt);
        if (days === 0) return 'bg-green-100 text-green-800';
        if (days <= 3) return 'bg-blue-100 text-blue-800';
        if (days <= 7) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'haute':
                return 'bg-red-100 text-red-800';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800';
            case 'basse':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Mes Réserves Assignées
                    </h2>
                </div>
            }
        >
            <Head title="Mes Réserves" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition-all"
                                >
                                    Réinitialiser tous les filtres
                                </button>
                            </div>
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
                                    localFilters.priority
                                        ? 'Aucune réserve ne correspond aux filtres sélectionnés'
                                        : 'Vous n\'avez aucune réserve assignée pour le moment.'}
                                </p>
                            </div>
                        ) : (
                            visibleReserves.map((reserve) => (
                                <Link
                                    key={reserve.id}
                                    href={route('agent.reserves.show', reserve.id)}
                                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {reserve.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(reserve.priority)}`}>
                                                        {reserve.priority}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-gray-600 mb-3 line-clamp-2">
                                                    {reserve.description}
                                                </p>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-semibold">👤 Client:</span> {reserve.user?.name || 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">📍 Appartement:</span> N° {reserve.appartement?.numero || 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">🏷️ Catégorie:</span> {reserve.categor?.name || 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">📊 Statut:</span> 
                                                        {(() => {
                                                            // Supporter un suivi unique ou un tableau de suivis, et prendre le dernier
                                                            const suivis = Array.isArray(reserve.suivi)
                                                                ? reserve.suivi
                                                                : reserve.suivi
                                                                ? [reserve.suivi]
                                                                : [];
                                                            const lastSuivi = suivis.length > 0 ? suivis[suivis.length - 1] : null;
                                                            const name = lastSuivi?.statut?.name || 'Non défini';
                                                            const lower = name.toLowerCase();

                                                            let colorClass = 'bg-gray-100 text-gray-800';
                                                            if (lower.includes('cours')) {
                                                                colorClass = 'bg-blue-100 text-blue-800';
                                                            } else if (lower.includes('résolu') || lower.includes('resolu') || lower.includes('termin')) {
                                                                colorClass = 'bg-green-100 text-green-800';
                                                            } else if (lower.includes('attente') || lower.includes('pending')) {
                                                                colorClass = 'bg-yellow-100 text-yellow-800';
                                                            }

                                                            return (
                                                                <span
                                                                    className={`ml-1 px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
                                                                >
                                                                    {name}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 border-t pt-3">
                                                    <span className="flex items-center">
                                                        <span className="text-lg mr-1">📅</span>
                                                        Créée le {formatDate(reserve.created_at)}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDaysColor(reserve.created_at)}`}>
                                                        {getDaysSinceCreation(reserve.created_at) === 0
                                                            ? 'Aujourd\'hui'
                                                            : getDaysSinceCreation(reserve.created_at) === 1
                                                            ? '1 jour'
                                                            : `${getDaysSinceCreation(reserve.created_at)} jours`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="ml-4 text-blue-600 text-2xl">
                                                →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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

