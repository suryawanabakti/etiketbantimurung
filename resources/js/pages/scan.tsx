import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Scan,
    QrCode,
    CheckCircle2,
    AlertCircle,
    User,
    Ticket as TicketIcon,
    Camera,
    CameraOff,
    RefreshCw,
    AlertTriangle,
    History,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface Props {
    history?: any[];
}

export default function ScanPage({ history = [] }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kode_qr: '',
    });

    const { flash } = usePage().props as any;
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [lastScanned, setLastScanned] = useState<any>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // Sort history: Latest first
    const sortedHistory = [...history].sort((a, b) => {
        return new Date(b.waktu_scan || 0).getTime() - new Date(a.waktu_scan || 0).getTime();
    });

    useEffect(() => {
        if (flash?.last_scanned) {
            setLastScanned(flash.last_scanned);
            setShowSuccess(true);
            setShowError(false);

            // Auto close after 5 seconds
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }

        if (flash?.error) {
            setErrorMessage(flash.error);
            setShowError(true);
            setShowSuccess(false);

            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!data.kode_qr) return;

        post('/tickets/scan', {
            preserveState: true,
            onSuccess: () => {
                reset('kode_qr');
            },
        });
    };

    const startScanner = async () => {
        setScanError(null);
        setIsScanning(true);

        try {
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = { fps: 15, qrbox: { width: 250, height: 250 } };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    stopScanner();
                    // Automatically submit when a code is found
                    router.post('/tickets/scan', { kode_qr: decodedText }, {
                        preserveState: true,
                        onSuccess: (res) => {
                            console.log(res)
                            alert("Berhasil scan")

                            reset('kode_qr');

                        }, onError: (err) => {
                            console.log(err)
                            alert("Gagal scan")
                            stopScanner();
                            reset('kode_qr');
                        }
                    });
                },
                (errorMessage) => {
                    // console.log(errorMessage);
                }
            );
        } catch (err: any) {
            setScanError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
            } catch (err) {
                console.error("Gagal menghentikan scanner", err);
            }
        }
        setIsScanning(false);
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Scan Tiket', href: '#' },
        ]}>
            <Head title="Scan Tiket" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Smart Validator</h1>
                            <Badge variant="secondary" className="text-[10px]">Gate Security</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Integrated Access Control & Validasi Tiket Cepat</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Camera Scanner Section */}
                    <Card className="lg:col-span-3 flex flex-col group overflow-hidden">
                        <div className="relative aspect-square md:aspect-video bg-muted/20 overflow-hidden border-b">
                            {!isScanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center shadow-sm border">
                                            <CameraOff className="w-8 h-8 opacity-50" />
                                        </div>
                                    </div>
                                    <div className="text-center px-8 space-y-2">
                                        <p className="font-semibold text-sm">Scanner Idle</p>
                                        <p className="text-xs text-muted-foreground max-w-[280px]">Nyalakan kamera untuk mulai memindai tiket pengunjung secara otomatis.</p>
                                    </div>
                                    <Button
                                        onClick={startScanner}
                                        className="h-10 px-6 mt-4"
                                    >
                                        <Camera className="w-4 h-4 mr-2" /> Mulai Scan Kamera
                                    </Button>
                                </div>
                            )}

                            <div id="reader" className={`${isScanning ? 'block' : 'hidden'} w-full h-full object-cover`} />

                            {isScanning && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-8 border border-primary/20 rounded-3xl flex items-center justify-center">
                                        <div className="w-full h-full max-w-[250px] max-h-[250px] border-2 border-primary/40 rounded-2xl relative overflow-hidden backdrop-blur-sm bg-background/5">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-[scan_2s_infinite] shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 bg-background/90 backdrop-blur-md rounded-xl flex items-center gap-4 border shadow-lg pointer-events-auto">
                                        <div className="flex items-center gap-2 px-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary animate-ping opacity-75 rounded-full" />
                                                <div className="relative bg-primary h-2 w-2 rounded-full" />
                                            </div>
                                            <span className="text-xs font-semibold">Aktif</span>
                                        </div>
                                        <div className="w-px h-4 bg-border" />
                                        <Button variant="ghost" size="sm" onClick={stopScanner} className="h-8 px-4 text-xs font-medium hover:bg-destructive hover:text-white transition-colors">Berhenti</Button>
                                    </div>
                                </div>
                            )}

                            {scanError && (
                                <div className="absolute inset-0 bg-slate-900/98 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="p-6 bg-rose-500/10 rounded-[32px] mb-8">
                                        <AlertTriangle className="w-16 h-16 text-rose-500" />
                                    </div>
                                    <h4 className="text-white font-black uppercase italic text-2xl mb-3 tracking-tight">Access Denied</h4>
                                    <p className="text-slate-400 font-medium text-sm mb-10 max-w-sm leading-relaxed">{scanError}</p>
                                    <Button onClick={startScanner} className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-xs h-16 px-10 shadow-xl">Retry</Button>
                                </div>
                            )}
                        </div>
                        <CardHeader className="p-12 border-t border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 bg-slate-900 rounded-lg">
                                    <RefreshCw className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Scan Protocol</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Position the QR code within the frame for automatic verification
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Manual Input Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden bg-background p-6 md:p-8">
                            <CardHeader className="p-0 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <QrCode className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-xl font-bold tracking-tight">Manual Override</CardTitle>
                                </div>
                                <CardDescription className="text-xs">Validasi manual jika scan kamera bermasalah.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Input
                                                placeholder="BTM-XXXXXXXXXX"
                                                className="h-14 font-mono text-lg uppercase focus-visible:ring-primary"
                                                value={data.kode_qr}
                                                onChange={e => setData('kode_qr', e.target.value.toUpperCase())}
                                            />
                                            {errors.kode_qr && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.kode_qr && (
                                            <div className="flex items-center gap-2 text-destructive font-medium text-xs px-2 animate-in fade-in slide-in-from-top-1">
                                                {errors.kode_qr}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full h-12"
                                        disabled={processing || !data.kode_qr}
                                    >
                                        {processing ? (
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        ) : null}
                                        Verifikasi Tiket
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden bg-primary/5 text-foreground p-8 flex flex-col justify-between border-primary/20 min-h-[280px]">
                            <div className="space-y-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[10px] bg-background">Secure Core</Badge>
                                        <h3 className="text-xl font-bold tracking-tight">Security Integrity</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        Pencatatan real-time aktif. Sistem keamanan sinkron. Pastikan koneksi stabil untuk verifikasi cepat.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border/50 mt-8 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">System Status</p>
                                    <p className="text-primary font-bold text-sm">Online & Ready</p>
                                </div>
                                <Scan className="w-8 h-8 opacity-50" />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Scan History Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-md hidden sm:block">
                            <History className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Riwayat Scan Terbaru</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Real-time log pemindaian hari ini</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map((item) => (
                                <Card key={item.id} className="p-5 flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <TicketIcon className="w-5 h-5" />
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="text-[9px] mb-1">Authenticated</Badge>
                                            <p className="text-xs font-mono font-semibold text-primary">{item.kode_qr}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Pengunjung</p>
                                            <h4 className="font-semibold text-sm truncate">{item.pemesanan?.user?.nama || 'Unknown User'}</h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[10px] uppercase font-semibold">Date</span>
                                                </div>
                                                <p className="text-xs font-medium">{new Date(item.waktu_scan).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-[10px] uppercase font-semibold">Time</span>
                                                </div>
                                                <p className="text-xs font-medium">{new Date(item.waktu_scan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center space-y-4 border rounded-xl bg-muted/10">
                                <div className="mx-auto w-16 h-16 bg-muted flex items-center justify-center rounded-2xl">
                                    <RefreshCw className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Belum ada riwayat scan pada hari ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-center text-2xl font-bold text-emerald-600 dark:text-emerald-400">Tiket Valid</DialogTitle>
                        <DialogDescription className="text-center">
                            Akses diberikan dengan sukses.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-4 my-2">
                        <div className="space-y-1 text-center">
                            <p className="text-xs text-muted-foreground font-semibold uppercase">Nama Pengunjung</p>
                            <p className="text-lg font-bold">{lastScanned?.pemesanan?.user?.nama || 'Verified Visitor'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                            <div className="space-y-1 text-center border-r">
                                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Kode Tiket</p>
                                <p className="text-sm font-mono font-bold text-primary">{lastScanned?.kode_qr}</p>
                            </div>
                            <div className="space-y-1 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Waktu Scan</p>
                                <p className="text-sm font-medium">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={() => setShowSuccess(false)} className="w-full mt-2">
                        Lanjut ke tiket berikutnya
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={showError} onOpenChange={setShowError}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-center text-2xl font-bold text-destructive">Akses Ditolak</DialogTitle>
                        <DialogDescription className="text-center">
                            Gagal memverifikasi tiket pengunjung.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted p-4 rounded-lg my-4 text-center">
                        <p className="text-sm font-medium">
                            "{errorMessage || 'Tiket sudah tidak aktif atau sudah digunakan.'}"
                        </p>
                    </div>

                    <Button variant="destructive" onClick={() => setShowError(false)} className="w-full">
                        Coba Lagi
                    </Button>
                </DialogContent>
            </Dialog>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                #reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border: none !important;
                    border-radius: 40px !important;
                }
                #reader {
                    border: none !important;
                    background: #0f172a !important;
                }
                #reader__scan_region {
                    background: transparent !important;
                }
                #reader__dashboard {
                    display: none !important;
                }
                /* Hide HTML5-QRCode auto elements */
                #reader img {
                    display: none !important;
                }
            `}} />
        </AppLayout>
    );
}
