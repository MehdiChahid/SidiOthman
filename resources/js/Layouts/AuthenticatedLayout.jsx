import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-3 sm:-my-px sm:ms-10 sm:flex items-center">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                                        route().current('dashboard')
                                            ? 'bg-blue-100 text-blue-700 font-bold shadow-md'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-xl mr-2">🏠</span>
                                    <span>Accueil</span>
                                </NavLink>
                                
                                {/* Menu pour les clients (role_id == 1 ou 5) */}
                                {user.role_id == 1 || user.role_id == 5 ? (
                                    <>
                                        <NavLink
                                            href={route('reserves.index')}
                                            active={route().current('reserves.index')}
                                            className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                                                route().current('reserves.index')
                                                    ? 'bg-purple-100 text-purple-700 font-bold shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">📋</span>
                                            <span>Mes Réserves</span>
                                        </NavLink>
                                        <NavLink
                                            href={route('reserves.create')}
                                            active={route().current('reserves.create')}
                                            className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 font-bold shadow-md ${
                                                route().current('reserves.create')
                                                    ? 'bg-green-200 text-green-800 ring-2 ring-green-400'
                                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">➕</span>
                                            <span>Nouvelle Réserve</span>
                                        </NavLink>
                                    </>
                                ) : null}

                                {/* Menu pour les managers (role_id == 3) */}
                                {user.role_id == 3 ? (
                                    <>
                                        <NavLink
                                            href={route('manager.reserves.index')}
                                            active={route().current('manager.reserves.*')}
                                            className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                                                route().current('manager.reserves.*')
                                                    ? 'bg-blue-100 text-blue-700 font-bold shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">📋</span>
                                            <span>Toutes les Réserves</span>
                                        </NavLink>
                                        <NavLink
                                            href={route('manager.reserves.create')}
                                            active={route().current('manager.reserves.create')}
                                            className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 font-bold shadow-md ${
                                                route().current('manager.reserves.create')
                                                    ? 'bg-green-200 text-green-800 ring-2 ring-green-400'
                                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">➕</span>
                                            <span>Créer Réserve</span>
                                        </NavLink>
                                        <NavLink
                                            href={route('manager.agents.index')}
                                            active={route().current('manager.agents.*')}
                                            className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                                                route().current('manager.agents.*')
                                                    ? 'bg-purple-100 text-purple-700 font-bold shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">👷</span>
                                            <span>Agents</span>
                                        </NavLink>
                                    </>
                                ) : null}

                                {/* Menu pour les agents/techniciens (role_id == 4) */}
                                {user.role_id == 4 ? (
                                    <>
                                        <NavLink
                                            href={route('agent.reserves.index')}
                                            active={route().current('agent.reserves.*')}
                                            className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                                                route().current('agent.reserves.*')
                                                    ? 'bg-blue-100 text-blue-700 font-bold shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-xl mr-2">📋</span>
                                            <span>Mes Réserves Assignées</span>
                                        </NavLink>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="flex items-center"
                                        >
                                            <span className="text-lg mr-2">👤</span>
                                            Mon Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center text-red-600"
                                        >
                                            <span className="text-lg mr-2">🚪</span>
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-2 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className={route().current('dashboard') 
                                ? 'bg-blue-100 text-blue-700 font-bold' 
                                : 'bg-gray-50 text-gray-700'
                            }
                        >
                            <span className="text-2xl mr-3">🏠</span>
                            <span>Accueil</span>
                        </ResponsiveNavLink>
                        
                        {/* Menu mobile pour clients */}
                        {(user.role_id == 1 || user.role_id == 5) && (
                            <>
                                <ResponsiveNavLink
                                    href={route('reserves.index')}
                                    active={route().current('reserves.index')}
                                    className={route().current('reserves.index')
                                        ? 'bg-purple-100 text-purple-700 font-bold'
                                        : 'bg-gray-50 text-gray-700'
                                    }
                                >
                                    <span className="text-2xl mr-3">📋</span>
                                    <span>Mes Réserves</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('reserves.create')}
                                    active={route().current('reserves.create')}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-md"
                                >
                                    <span className="text-2xl mr-3">➕</span>
                                    <span>Nouvelle Réserve</span>
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* Menu mobile pour managers */}
                        {user.role_id == 3 && (
                            <>
                                <ResponsiveNavLink
                                    href={route('manager.reserves.index')}
                                    active={route().current('manager.reserves.*')}
                                    className={route().current('manager.reserves.*')
                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                        : 'bg-gray-50 text-gray-700'
                                    }
                                >
                                    <span className="text-2xl mr-3">📋</span>
                                    <span>Toutes les Réserves</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('manager.reserves.create')}
                                    active={route().current('manager.reserves.create')}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-md"
                                >
                                    <span className="text-2xl mr-3">➕</span>
                                    <span>Créer Réserve</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('manager.agents.index')}
                                    active={route().current('manager.agents.*')}
                                    className={route().current('manager.agents.*')
                                        ? 'bg-purple-100 text-purple-700 font-bold'
                                        : 'bg-gray-50 text-gray-700'
                                    }
                                >
                                    <span className="text-2xl mr-3">👷</span>
                                    <span>Agents</span>
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* Menu mobile pour agents/techniciens */}
                        {user.role_id == 4 && (
                            <>
                                <ResponsiveNavLink
                                    href={route('agent.reserves.index')}
                                    active={route().current('agent.reserves.*')}
                                    className={route().current('agent.reserves.*')
                                        ? 'bg-blue-100 text-blue-700 font-bold'
                                        : 'bg-gray-50 text-gray-700'
                                    }
                                >
                                    <span className="text-2xl mr-3">📋</span>
                                    <span>Mes Réserves Assignées</span>
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-2">
                            <ResponsiveNavLink 
                                href={route('profile.edit')}
                                className="bg-gray-50 text-gray-700"
                            >
                                <span className="text-xl mr-3">👤</span>
                                <span>Mon Profil</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="bg-red-50 text-red-700"
                            >
                                <span className="text-xl mr-3">🚪</span>
                                <span>Déconnexion</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
