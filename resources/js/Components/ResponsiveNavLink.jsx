import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    // Si className contient des classes personnalisées, les utiliser directement
    const hasCustomClasses = className.includes('bg-') || className.includes('text-');
    
    return (
        <Link
            {...props}
            className={
                hasCustomClasses
                    ? `flex w-full items-center py-3 px-4 text-base font-medium transition duration-150 ease-in-out focus:outline-none rounded-lg mx-2 mb-1 ${className}`
                    : `flex w-full items-center border-l-4 py-3 pe-4 ps-3 text-base font-medium transition duration-150 ease-in-out focus:outline-none rounded-lg mx-2 mb-1 ${
                        active
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                            : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                    } ${className}`
            }
        >
            {children}
        </Link>
    );
}
