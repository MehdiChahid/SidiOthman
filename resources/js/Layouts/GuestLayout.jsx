import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen">
            {/* Logo en haut à gauche (optionnel, pour les pages de login/register) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                <Link href="/" className="block">
                    <div className="flex items-center space-x-3">
                        <div className="text-4xl">🏠</div>
                        <div className="hidden sm:block">
                            <div className="text-xl font-bold text-gray-800">Sidi Othman</div>
                            <div className="text-sm text-gray-600">Gestion de Réserves</div>
                        </div>
                    </div>
                </Link>
            </div>
            {children}
        </div>
    );
}
