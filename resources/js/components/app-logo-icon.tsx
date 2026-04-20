import { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.jpeg"
            alt="Logo"
            className={className}
            {...props}
        />
    );
}
