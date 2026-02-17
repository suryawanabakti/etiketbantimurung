import { dashboard, home, login, register } from '@/routes';
import { Link, usePage, router } from '@inertiajs/react';
import { type ReactNode, useState, useEffect } from 'react';
import { User, LogOut, Ticket, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
    children: ReactNode;
}

export default function VisitorLayout({ children }: Props) {
    const { auth } = usePage().props as any;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll(); // Initial check
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };


    return (
        <div className="min-h-screen bg-white font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Elegant Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 py-3' : 'bg-transparent py-5 md:py-7'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                    <Link href={home()} className="flex items-center gap-2 md:gap-3 group">
                        <div className="bg-rose-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <Ticket className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className={`text-xl md:text-2xl font-black tracking-tighter italic uppercase transition-colors text-slate-900`}>Bantimurung</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-slate-600 hover:text-rose-600 transition-colors">Beranda</Link>
                        <Link href="/dashboard#tickets" className="text-sm font-black uppercase tracking-widest text-slate-600 hover:text-rose-600 transition-colors">Beli Tiket</Link>
                        <Link href="/dashboard#my-tickets" className="text-sm font-black uppercase tracking-widest text-slate-600 hover:text-rose-600 transition-colors">Tiket Saya</Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 overflow-hidden border-2 border-slate-200 hover:border-rose-500 transition-all">
                                    <div className="flex items-center justify-center w-full h-full bg-slate-100 text-rose-600 font-black text-lg uppercase">
                                        {auth.user.nama.charAt(0)}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 rounded-3xl p-2 shadow-2xl border-none mt-2" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal p-4">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-black text-slate-900 italic uppercase">{auth.user.nama}</p>
                                        <p className="text-xs font-bold text-slate-400">{auth.user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-2xl p-4 font-bold flex items-center gap-3 cursor-pointer">
                                    <LogOut className="w-4 h-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-4 right-4 bg-white rounded-[32px] shadow-2xl p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4 duration-300 mt-2 border border-slate-100">
                        <Link href="/dashboard" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
                        <Link href="/dashboard#tickets" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Beli Tiket</Link>
                        <Link href="/dashboard#my-tickets" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Tiket Saya</Link>
                        <button className="p-4 font-black text-rose-600 text-left uppercase tracking-widest text-sm" onClick={handleLogout}>Keluar</button>
                    </div>
                )}
            </nav>

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
                        <div className="flex items-center gap-3 grayscale opacity-60">
                            <div className="bg-slate-800 p-2 rounded-xl text-white">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tighter italic uppercase">Bantimurung</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                            <a href="#" className="hover:text-rose-500 transition-colors">Tentang Kami</a>
                            <a href="#" className="hover:text-rose-500 transition-colors">Bantuan</a>
                            <a href="#" className="hover:text-rose-500 transition-colors">Syarat & Ketentuan</a>
                            <a href="#" className="hover:text-rose-500 transition-colors">Privasi</a>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} Bantimurung Waterpark. Maros Regancy.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
