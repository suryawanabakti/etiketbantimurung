import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <AppLogoIcon className="h-8 w-8 rounded-md object-cover" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-black uppercase italic text-slate-900 dark:text-white">
                    Bantimurung
                </span>
            </div>
        </div>
    );
}
