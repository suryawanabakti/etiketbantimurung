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

                <Link href={home()} className="relative z-10 flex items-center gap-2 group w-fit">
                    <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
                        <Ticket className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white transition-colors">Bantimurung</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
                        Selamat Datang <br />Kembali
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Masuk ke akun Anda untuk mengelola tiket dan melanjutkan petualangan di Taman Nasional Bantimurung.
                    </p>
                </div>

                <div className="relative z-10 text-slate-400 text-sm font-medium">
                    © {new Date().getFullYear()} Wisata Alam Maros
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-background relative">
                <div className="absolute top-8 left-8 md:hidden">
                    <Link href={home()} className="flex items-center gap-2 text-primary font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Masuk Akun</h1>
                        <p className="text-muted-foreground">Silakan masukkan email dan password Anda.</p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-8"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="m@example.com"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <Link
                                                    href={request()}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                    tabIndex={5}
                                                >
                                                    Lupa password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember" className="font-normal cursor-pointer">Ingat saya</Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <Spinner className="mr-2 h-4 w-4" />}
                                        Masuk
                                    </Button>
                                </div>

                                {canRegister && (
                                    <div className="text-center text-sm">
                                        <span className="text-muted-foreground">Belum punya akun? </span>
                                        <Link
                                            href={register()}
                                            className="font-medium text-primary hover:underline"
                                            tabIndex={5}
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="p-3 bg-muted text-center text-sm font-medium rounded-md">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
