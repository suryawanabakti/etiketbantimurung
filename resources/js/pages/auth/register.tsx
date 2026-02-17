import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import { Ticket, ArrowLeft, UserPlus, Mail, Lock, User, Phone } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
            <Head title="Daftar Akun - Bantimurung" />

            {/* Left Side: Visual / Brand */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1582103287241-2762adba6c36?q=80&w=1974&auto=format&fit=crop"
                        alt="Bantimurung Nature"
                        className="w-full h-full object-cover opacity-40 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-900/50 via-slate-900/20 to-transparent" />
                </div>

                <Link href={home()} className="relative z-10 flex items-center gap-3 group">
                    <div className="bg-rose-600 p-2.5 rounded-2xl text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white italic uppercase">Bantimurung</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-5xl font-black text-white leading-tight mb-6 uppercase italic tracking-tighter">
                        Mulai <br /><span className="text-rose-500">Petualanganmu</span>
                    </h2>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed">
                        Daftar sekarang untuk mendapatkan akses mudah ke tiket masuk dan fasilitas premium di Taman Nasional Bantimurung.
                    </p>
                </div>

                <div className="relative z-10 text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} Wisata Alam Maros
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-white relative overflow-y-auto">
                <div className="absolute top-8 left-8 md:hidden">
                    <Link href={home()} className="flex items-center gap-2 text-rose-600 font-black uppercase tracking-widest text-sm italic">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8 py-12 md:py-0">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Daftar Akun</h1>
                        <p className="text-slate-400 font-medium text-lg leading-tight">Lengkapi data diri Anda untuk membuat akun baru.</p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nama Lengkap</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="name"
                                                type="text"
                                                name="nama"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                placeholder="Contoh: Budi Santoso"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.nama} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="no_hp" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">No. WhatsApp</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="no_hp"
                                                type="tel"
                                                name="no_hp"
                                                required
                                                tabIndex={3}
                                                placeholder="0812XXXXXXXX"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.no_hp} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Konfirmasi Password</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                                                <Lock className="w-5 h-5 opacity-50" />
                                            </div>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                required
                                                tabIndex={5}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-16 w-full rounded-2xl bg-rose-600 hover:bg-rose-700 text-lg font-black uppercase tracking-widest shadow-2xl shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] group mt-4"
                                        tabIndex={6}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                Buat Akun Sekarang
                                                <UserPlus className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="text-center pt-2">
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                        Sudah punya akun?{' '}
                                        <Link
                                            href={login()}
                                            className="text-rose-600 hover:text-rose-700 transition-colors font-black ml-1 border-b-2 border-rose-100 hover:border-rose-500"
                                            tabIndex={6}
                                        >
                                            Masuk Disini
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
