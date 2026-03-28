import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/shared/hooks/use-appearance';
import AuthLayout from '@/shared/ui/layouts/auth-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
        const page = pages[`../pages/${name}.tsx`];
        if (!page) throw new Error(`Page not found: ${name}`);
        return page;
    },
    layout: (name) => {
        if (name.startsWith('auth/')) {
            return AuthLayout;
        }
        return null;
    },
    strictMode: true,
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
