import AppLogoIcon from '@/components/app-logo-icon';
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

                <Link href={home()} className="relative z-10 flex items-center gap-2 group w-fit">
                    <AppLogoIcon className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-lg transition-transform group-hover:scale-105 object-cover" />
                    <span className="text-xl font-bold tracking-tight text-white transition-colors">Bantimurung</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
                        Mulai <br />Petualanganmu
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Daftar sekarang untuk mendapatkan akses mudah ke tiket masuk dan fasilitas premium di Taman Nasional Bantimurung.
                    </p>
                </div>

                <div className="relative z-10 text-slate-400 text-sm font-medium">
                    © {new Date().getFullYear()} Wisata Alam Maros
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-background relative overflow-y-auto">
                <div className="absolute top-8 left-8 md:hidden">
                    <Link href={home()} className="flex items-center gap-2 text-primary font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-6 py-12 md:py-0">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Daftar Akun</h1>
                        <p className="text-muted-foreground">Lengkapi data diri Anda untuk membuat akun baru.</p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <User className="w-4 h-4" />
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
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.nama} />
                                    </div>

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
                                                tabIndex={2}
                                                autoComplete="email"
                                                placeholder="m@example.com"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="no_hp">No. WhatsApp</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <Input
                                                id="no_hp"
                                                type="tel"
                                                name="no_hp"
                                                required
                                                tabIndex={3}
                                                placeholder="0812XXXXXXXX"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.no_hp} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Lock className="w-4 h-4 opacity-70" />
                                            </div>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                required
                                                tabIndex={5}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-2"
                                        tabIndex={6}
                                        disabled={processing}
                                    >
                                        {processing && <Spinner className="mr-2 h-4 w-4" />}
                                        Buat Akun
                                    </Button>
                                </div>

                                <div className="text-center text-sm pt-2">
                                    <span className="text-muted-foreground">Sudah punya akun? </span>
                                    <Link
                                        href={login()}
                                        className="font-medium text-primary hover:underline"
                                        tabIndex={6}
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
