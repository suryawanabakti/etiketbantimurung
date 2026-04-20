import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Ticket, Menu, X, LogOut, ChevronRight, User, Badge as BadgeIcon, MapPin, Phone, Mail } from 'lucide-react';
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
        document.getElementById('order-ticket')?.scrollIntoView({ behavior: 'smooth' });
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
                        <AppLogoIcon className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-105 object-cover" />
                        <span className="text-lg md:text-xl font-bold tracking-tight uppercase text-white">Bantimurung</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-12">
                        <div className="flex items-center gap-6 lg:gap-8 text-sm font-medium text-white/90">
                            <a href="#features" className="hover:text-white transition-colors">Fitur</a>
                            <a href="#tickets" className="hover:text-white transition-colors">Tiket</a>
                            <a href="#about" className="hover:text-white transition-colors">Tentang</a>
                            <a href="#contact" className="hover:text-white transition-colors">Kontak</a>
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
                        className="md:hidden w-12 h-12 rounded-xl text-white hover:bg-white/10 p-0 flex items-center justify-center [&>svg]:!w-7 [&>svg]:!h-7"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={0} strokeWidth={1.5} /> : <Menu size={0} strokeWidth={1.5} />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-4 right-4 bg-white rounded-[32px] shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 mt-2 border border-slate-100">
                        <a href="#home" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Beranda</a>
                        <a href="#features" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
                        <button onClick={() => { setMobileMenuOpen(false); scrollToTickets(); }} className="p-4 font-black text-slate-900 border-b border-slate-50 text-left uppercase tracking-widest text-sm">Tiket</button>
                        <a href="#contact" className="p-4 font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest text-sm" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
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
                <section className="py-16 bg-white overflow-hidden" id='about'>
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

                {/* Gallery Section */}
                <section className="pt-16 pb-6 bg-slate-50" id="gallery">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="text-center mb-16 space-y-4">
                            <Badge className="bg-red-100 text-red-800 border-none font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] text-[10px]">Galeri Wisata</Badge>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                                Potret <span className="text-red-800">Bantimurung</span>
                            </h2>
                            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                                Intip keindahan memukau dari The Kingdom of Butterfly! Mulai dari kemegahan air terjun, pesona alam hingga keseruan menjelajah setiap sudut Bantimurung Maros.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Gambar 1 */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-lg h-80">
                                <img src="https://nativeindonesia.com/foto/2020/10/landmark-bantimurung.jpg" alt="Landmark Bantimurung" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Landmark Khas</h3>
                                    <p className="text-sm text-slate-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Patung maskot kupu-kupu raksasa ikonik yang menyambut kedatangan setiap pengunjung.</p>
                                </div>
                            </div>

                            {/* Gambar 2 */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-lg h-80 md:col-span-2 lg:col-span-1">
                                <img src="https://nativeindonesia.com/foto/2020/10/landscape-keindahan-air-terjun-bantimurung.jpg" alt="Keindahan Air Terjun" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Air Terjun Bantimurung</h3>
                                    <p className="text-sm text-slate-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Aliran air terjun deras di tengah rimbunnya hutan tropis karst alami.</p>
                                </div>
                            </div>

                            {/* Gambar 3 */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-lg h-80">
                                <img src="https://nativeindonesia.com/wp-content/uploads/2020/10/jalan-menuju-air-terjun-bantimurung.jpg" alt="Jalan Menuju Air Terjun" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Akses yang Nyaman</h3>
                                    <p className="text-sm text-slate-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Jalan pendestrian berkanopi rindang yang memanjakan langkah kaki Anda menuju area utama.</p>
                                </div>
                            </div>

                            {/* Gambar 4 */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-lg h-80 lg:col-span-2">
                                <img src="https://nativeindonesia.com/foto/2020/10/ragam-keseruan-di-air-terjun.jpg" alt="Ragam Keseruan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Keseruan Tanpa Batas</h3>
                                    <p className="text-sm text-slate-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Bermain air, bersantai di tepian, dan menghabiskan waktu berkualitas bersama keluarga dan kerabat terdekat.</p>
                                </div>
                            </div>

                            {/* Gambar 5 */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-lg h-80">
                                <img src="https://nativeindonesia.com/wp-content/uploads/2021/07/Menjelajah-Goa.jpg" alt="Menjelajah Goa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Pesona Gua Karst</h3>
                                    <p className="text-sm text-slate-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Eksplorasi stalaktit dan stalagmit batuan karst yang terbentuk secara alami sejak ribuan tahun lalu.</p>
                                </div>
                            </div>

                            {/* Gambar 6 */}
                            <div className="group relative rounded-3xl overflow-hidden shadow-lg h-80 md:col-span-2 lg:col-span-3">
                                <img src="https://nativeindonesia.com/wp-content/uploads/2021/07/serunya-main-air.jpg" alt="Serunya Main Air" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Pemandian Alam Segar</h3>
                                    <p className="text-sm text-slate-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Tempat ideal untuk berenang dan bermain air bersih pegunungan di bawah teduhnya alam Maros.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id='tickets' className='mb-5'></section>
                <section id="" className="pt-6 pb-12 md:pt-10 md:pb-20 bg-white scroll-mt-24">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="text-center mb-16 md:mb-20 space-y-4" id='order-ticket'>
                            <Badge className="bg-red-100 text-red-800 border-none font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] text-[10px]">Pilih Petualanganmu</Badge>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic">Tiket Wisata Alam</h2>
                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4">Pilih jenis tiket yang sesuai dengan kebutuhan kunjungan Anda ke Taman Nasional Bantimurung.</p>
                        </div>

                        {tikets.length > 0 ? (
                            <div className="max-w-xl mx-auto" >
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
                <section id="contact" className="py-20 md:py-32 bg-slate-50 scroll-mt-20">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <Badge className="bg-red-100 text-red-800 border-none font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] text-[10px]">Hubungi Kami</Badge>
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                                        Rencanakan <span className="text-red-800">Kunjungan</span> Anda
                                    </h2>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
                                        Punya pertanyaan tentang fasilitas atau butuh bantuan pemesanan? Tim kami siap melayani Anda.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm text-red-800 group-hover:bg-red-800 group-hover:text-white transition-all duration-300 border border-slate-100">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Lokasi</p>
                                            <p className="text-slate-900 font-bold leading-relaxed">Jl. Poros Maros-Bone KM.12, Bantimurung, Maros, Sulawesi Selatan 90561</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm text-red-800 group-hover:bg-red-800 group-hover:text-white transition-all duration-300 border border-slate-100">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                                            <p className="text-slate-900 font-bold">+62 877-1352-3594</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm text-red-800 group-hover:bg-red-800 group-hover:text-white transition-all duration-300 border border-slate-100">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                            <p className="text-slate-900 font-bold">info@bantimurung.maros.go.id</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-4 bg-red-800/5 rounded-[48px] blur-2xl transition-all duration-500 group-hover:bg-red-800/10" />
                                <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden h-[450px]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127193.55585260599!2d119.59261167688932!3d-4.973109647915603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbef7f488eb5355%3A0x46b6dae8c1291f1e!2skawasan%20wisata%20Bantimurung!5e0!3m2!1sid!2sid!4v1776700000895!5m2!1sid!2sid"
                                        className="w-full h-full rounded-[32px]"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>



            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-16 border-t-8 border-red-800">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <AppLogoIcon className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg border-2 border-white object-cover" />
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

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/6287713523594"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[60] group flex items-center gap-3"
                aria-label="Chat WhatsApp"
            >
                <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden md:block">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest whitespace-nowrap">Hubungi Kami</p>
                </div>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all duration-300">
                    <svg
                        viewBox="0 0 24 24"
                        className="w-7 h-7 md:w-8 md:h-8 fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </div>
            </a>
        </div>

    );
}
