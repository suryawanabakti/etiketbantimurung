import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Ticket, Menu, X, LogOut, ChevronRight, User, Badge as BadgeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import TicketList from '@/components/landing/ticket-list';
import BookingSummary from '@/components/landing/booking-summary';

interface Tiket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
    tanggal_berlaku: string | null;
}

export default function Welcome({
    canRegister = true,
    tikets = [],
}: {
    canRegister?: boolean;
    tikets?: Tiket[];
}) {
    const { auth, flash } = usePage<SharedData>().props as any;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedTiket, setSelectedTiket] = useState<Tiket | null>(null);
    const [jumlah, setJumlah] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        if (flash && flash.snapToken) {
            // @ts-ignore
            window.snap.pay(flash.snapToken, {
                onSuccess: (result: any) => {
                    const orderId = result.order_id.split('-')[1];
                    router.visit(`/booking/${orderId}/success`);
                },
                onPending: () => {
                    router.visit('/dashboard');
                },
                onError: () => alert('Pembayaran gagal, silakan coba lagi.'),
                onClose: () => setLoading(false),
            });
        }
        if (flash && flash.error) alert(flash.error);
    }, [flash]);

    const handleBooking = () => {
        if (!auth.user) {
            router.visit(login());
            return;
        }
        if (!selectedTiket) return;
        setLoading(true);
        router.post('/booking', {
            tiket_id: selectedTiket.id,
            jumlah_tiket: jumlah,
        }, {
            onFinish: () => setLoading(false),
            preserveState: true,
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const scrollToTickets = () => {
        document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-red-100 selection:text-red-900" style={{ fontFamily: "'Lexend', sans-serif" }}>
            <Head>
                <title>Selamat Datang di Bantimurung</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-red-800/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent bg-gradient-to-b from-black/50 to-transparent py-5 md:py-7'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-white p-1.5 md:p-2 rounded-full text-red-800 shadow-md transition-transform group-hover:scale-105">
                            <Ticket className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-lg md:text-xl font-bold tracking-tight uppercase text-white">Bantimurung</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-12">
                        <div className="flex items-center gap-6 lg:gap-8 text-sm font-medium text-white/90">
                            <a href="#features" className="hover:text-white transition-colors">Fitur</a>
                            <a href="#tickets" className="hover:text-white transition-colors">Tiket</a>
                            <a href="#about" className="hover:text-white transition-colors">Tentang</a>
                        </div>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-white/30 hover:bg-white/10 transition-all">
                                            <div className="flex items-center justify-center w-full h-full text-white font-bold text-base">
                                                {auth.user.nama.charAt(0)}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 rounded-3xl p-2 shadow-2xl border-none" align="end">
                                        <DropdownMenuLabel className="font-normal p-4">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-black text-slate-900 italic uppercase">{auth.user.nama}</p>
                                                <p className="text-xs font-bold text-slate-400">{auth.user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={dashboard()} className="rounded-2xl p-3 font-bold flex items-center gap-3 cursor-pointer">
                                                <User className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-700 focus:text-red-800 focus:bg-red-50 rounded-2xl p-3 font-bold flex items-center gap-3 cursor-pointer">
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant="ghost" className="rounded-full px-4 h-10 text-sm font-medium text-white hover:bg-white/10">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button className="bg-white/10 border border-white/30 hover:bg-white/20 text-white rounded-full px-6 h-10 text-sm font-medium shadow-sm transition-all">
                                            Daftar
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-xl text-white hover:bg-white/10"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="font-bold w-16 h-16" /> : <Menu className="font-bold w-16 h-16" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-4 right-4 bg-white rounded-[32px] shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 mt-2 border border-slate-100">
                        <a href="#features" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
                        <button onClick={() => { setMobileMenuOpen(false); scrollToTickets(); }} className="p-4 font-black text-slate-900 border-b border-slate-50 text-left uppercase tracking-widest text-sm">Tiket</button>
                        {auth.user ? (
                            <>
                                <Link href={dashboard()} className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                <button className="p-4 font-black text-red-700 text-left uppercase tracking-widest text-sm" onClick={handleLogout}>Keluar</button>
                            </>
                        ) : (
                            <>
                                <Link href={login()} className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
                                <Link href={register()} className="p-4 bg-gradient-to-r from-violet-700 to-red-600 hover:from-violet-800 hover:to-red-700 text-white rounded-2xl font-black text-center uppercase tracking-widest text-sm transition-all" onClick={() => setMobileMenuOpen(false)}>Daftar</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <main>
                <Hero onCtaClick={scrollToTickets} onCheckTicketsClick={() => auth.user ? router.visit(dashboard()) : router.visit(login())} />

                <Features />

                {/* Discover Section */}
                <section className="py-24 bg-white overflow-hidden" id='about'>
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                            <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                                <Badge className="bg-red-100 text-red-800 border-none font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] text-[10px]">Eksplorasi Keajaiban</Badge>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                                    Temukan <span className="text-red-800">Keajaiban</span> di Setiap Sudut
                                </h2>
                                <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                                    Dari gemuruh air terjun yang menyegarkan hingga tarian ribuan kupu-kupu yang mempesona, Bantimurung menawarkan pengalaman yang akan membekas selamanya di hati Anda.
                                </p>
                                <div className="grid grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <p className="text-4xl font-black text-slate-900 italic">80+</p>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Spesies Kupu-kupu</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-4xl font-black text-slate-900 italic">15m</p>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tinggi Air Terjun</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute -inset-4 bg-red-800/5 rounded-[48px] blur-2xl group-hover:bg-red-800/10 transition-colors duration-500" />
                                <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-red-900/10">
                                    <img
                                        src="/gambar2.jpeg"
                                        alt="Wonder of Bantimurung"
                                        className="w-full aspect-[4/5] object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white">
                                        <p className="text-xl font-bold italic uppercase tracking-tight">"Surga di tanah Maros yang tersembunyi"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tickets" className="py-20 md:py-32 bg-slate-50 scroll-mt-24">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="text-center mb-16 md:mb-20 space-y-4">
                            <Badge className="bg-red-100 text-red-800 border-none font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] text-[10px]">Pilih Petualanganmu</Badge>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic">Tiket Wisata Alam</h2>
                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4">Pilih jenis tiket yang sesuai dengan kebutuhan kunjungan Anda ke Taman Nasional Bantimurung.</p>
                        </div>

                        {tikets.length > 0 ? (
                            <div className="max-w-xl mx-auto">
                                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 group transition-all duration-300 hover:shadow-red-900/10">
                                    <div className="bg-red-800 p-8 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-10 bg-repeat bg-[length:20px_20px]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)" }}></div>
                                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tight relative z-10">{tikets[0].nama_tiket}</h3>
                                    </div>
                                    <div className="p-8 md:p-10 space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2 text-center">
                                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Harga Tiket</span>
                                                <span className="text-lg md:text-xl font-black text-red-600">{formatCurrency(tikets[0].harga)}</span>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2 text-center">
                                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Kuota</span>
                                                <span className="text-lg md:text-xl font-black text-slate-900">{tikets[0].kuota > 0 ? `${tikets[0].kuota} Tersedia` : 'Habis'}</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => router.visit('/dashboard')}
                                            className="w-full h-16 rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-black text-base md:text-lg uppercase tracking-widest shadow-xl shadow-red-900/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            <Ticket className="w-5 h-5 md:w-6 md:h-6" /> Beli Sekarang
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-slate-200 shadow-xl max-w-2xl mx-auto">
                                <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-6 opacity-50" />
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic">Tiket Belum Tersedia</h3>
                                <p className="text-slate-500 font-medium max-w-md mx-auto mt-2">Nantikan pembukaan tiket wisata Bantimurung dalam waktu dekat.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>



            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-24 border-t-8 border-red-800">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="bg-white p-2 text-red-800 rounded-xl shadow-lg">
                                <Ticket className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter italic uppercase">Bantimurung</span>
                        </div>
                        <p className="text-xl leading-relaxed max-w-md font-medium text-gray-300">
                            Nikmati keindahan alam Maros dengan akses cepat dan mudah. Pesan tiket Anda sekarang dan rasakan pengalaman tak terlupakan.
                        </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-12 text-center md:text-right">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            <span className="text-white font-black uppercase tracking-widest text-sm hover:text-red-500 cursor-pointer transition-colors">Tentang</span>
                            <span className="text-white font-black uppercase tracking-widest text-sm hover:text-red-500 cursor-pointer transition-colors">Wisata</span>
                            <span className="text-white font-black uppercase tracking-widest text-sm hover:text-red-500 cursor-pointer transition-colors">Panduan</span>
                            <span className="text-white font-black uppercase tracking-widest text-sm hover:text-red-500 cursor-pointer transition-colors">Kontak</span>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray-400">© {new Date().getFullYear()} Taman Wisata Bantimurung Maros. <br />All rights reserved.</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Terdaftar di Kemenparekraf RI</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
