import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Ticket, ArrowLeft, LogIn, Mail, Lock } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
            <Head title="Masuk - Bantimurung" />

            {/* Left Side: Visual / Brand */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"
                        alt="Bantimurung"
                        className="w-full h-full object-cover opacity-30 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/40 via-transparent to-transparent" />
                </div>

                <Link href={home()} className="relative z-10 flex items-center gap-3 group">
                    <div className="bg-rose-600 p-2.5 rounded-2xl text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white italic uppercase transition-colors">Bantimurung</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-5xl font-black text-white leading-tight mb-6 uppercase italic tracking-tighter">
                        Selamat Datang <br /><span className="text-rose-500">Kembali</span>
                    </h2>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed">
                        Masuk ke akun Anda untuk mengelola tiket dan melanjutkan petualangan di Taman Nasional Bantimurung.
                    </p>
                </div>

                <div className="relative z-10 text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} Wisata Alam Maros
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-white relative">
                <div className="absolute top-8 left-8 md:hidden">
                    <Link href={home()} className="flex items-center gap-2 text-rose-600 font-black uppercase tracking-widest text-sm italic">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Masuk Akun</h1>
                        <p className="text-slate-400 font-medium text-lg leading-tight">Silakan masukkan email dan password Anda.</p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-8"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-6">
                                    <div className="space-y-3">
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
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Password</Label>
                                            {canResetPassword && (
                                                <Link
                                                    href={request()}
                                                    className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors uppercase tracking-widest"
                                                    tabIndex={5}
                                                >
                                                    Lupa Password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3 ml-1">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="rounded-md border-slate-200 text-rose-600 focus:ring-rose-500/20"
                                        />
                                        <Label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer">Ingat saya</Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-16 w-full rounded-2xl bg-rose-600 hover:bg-rose-700 text-lg font-black uppercase tracking-widest shadow-2xl shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2" />
                                        ) : (
                                            <>
                                                Masuk Sekarang
                                                <LogIn className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {canRegister && (
                                    <div className="text-center pt-4">
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                            Belum punya akun?{' '}
                                            <Link
                                                href={register()}
                                                className="text-rose-600 hover:text-rose-700 transition-colors font-black ml-1 border-b-2 border-rose-100 hover:border-rose-500"
                                                tabIndex={5}
                                            >
                                                Daftar Disini
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="p-4 rounded-2xl bg-emerald-50 text-center text-sm font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 italic">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
