import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    // Si className contient des classes personnalisées, les utiliser directement
    const hasCustomClasses = className.includes('bg-') || className.includes('text-') || className.includes('border-');
    
    return (
        <Link
            {...props}
            className={
                hasCustomClasses
                    ? className + (active ? ' ring-2 ring-offset-2 ring-blue-500' : '')
                    : 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                          ? 'border-blue-500 text-blue-600 font-bold focus:border-blue-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800 focus:border-gray-300 focus:text-gray-800') +
                className
            }
        >
            {children}
        </Link>
    );
}
