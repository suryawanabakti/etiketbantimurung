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
        <AppLayout>
            <Head title="Scan Tiket" />

            <div className="p-6 md:p-10 space-y-12 max-w-6xl mx-auto font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <Badge className="bg-rose-500/10 text-rose-500 border-none px-4 py-1 rounded-full font-black uppercase tracking-widest text-[10px]">Gate Security</Badge>
                        <h1 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Smart Validator</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Integrated Access Control</p>
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-5">
                    {/* Camera Scanner Section */}
                    <Card className="lg:col-span-3 border-none shadow-2xl shadow-slate-200/50 rounded-[48px] overflow-hidden bg-white flex flex-col group transition-all duration-500 hover:shadow-rose-500/5">
                        <div className="relative aspect-square md:aspect-video bg-slate-900 overflow-hidden">
                            {!isScanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-rose-500 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative w-28 h-28 rounded-[40px] bg-slate-800 flex items-center justify-center shadow-2xl border border-white/5">
                                            <CameraOff className="w-12 h-12 text-slate-600" />
                                        </div>
                                    </div>
                                    <div className="text-center px-12 space-y-3">
                                        <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-300">Scanner Engine Idle</p>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[280px]">Ready for high-speed ticket verification. Please activate camera to begin scanning.</p>
                                    </div>
                                    <Button
                                        onClick={startScanner}
                                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-[24px] px-12 h-18 font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-900/40 active:scale-95 transition-all group/btn"
                                    >
                                        <Camera className="w-5 h-5 mr-3 group-hover/btn:rotate-12 transition-transform" /> Start High-Speed Scan
                                    </Button>
                                </div>
                            )}

                            <div id="reader" className={`${isScanning ? 'block' : 'hidden'} w-full h-full`} />

                            {isScanning && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-10 border-2 border-rose-500/20 rounded-[40px] flex items-center justify-center">
                                        <div className="w-full h-full max-w-[300px] max-h-[300px] border-4 border-rose-500/40 rounded-3xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-[scan_2s_infinite] shadow-[0_0_25px_rgba(244,63,94,1)] z-10" />
                                            {/* Corners */}
                                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-rose-500" />
                                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-rose-500" />
                                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-rose-500" />
                                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-rose-500" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-slate-900/90 backdrop-blur-2xl rounded-2xl flex items-center gap-6 text-white pointer-events-auto shadow-2xl border border-white/10">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-rose-600 animate-ping opacity-75 rounded-full" />
                                                <div className="relative bg-rose-600 h-3 w-3 rounded-full" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scanner Active</span>
                                        </div>
                                        <div className="w-px h-4 bg-white/10" />
                                        <Button variant="ghost" size="sm" onClick={stopScanner} className="text-white hover:bg-rose-500 hover:text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase transition-colors">Terminate</Button>
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
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[48px] overflow-hidden bg-white p-8 md:p-10 transition-all hover:shadow-slate-300/50">
                            <CardHeader className="p-0 mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <QrCode className="w-5 h-5 text-rose-500" />
                                    <CardTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Manual Override</CardTitle>
                                </div>
                                <CardDescription className="text-slate-400 font-medium text-xs">Execute manual validation when scanner is inaccessible.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <Input
                                                placeholder="BTM-XXXXXXXXXX"
                                                className="h-24 pl-8 pr-8 rounded-[32px] border-slate-100 bg-slate-50/80 text-2xl font-black tracking-[0.15em] uppercase focus:ring-rose-500 focus:border-rose-500 focus:bg-white transition-all italic text-slate-900"
                                                value={data.kode_qr}
                                                onChange={e => setData('kode_qr', e.target.value.toUpperCase())}
                                            />
                                            {errors.kode_qr && (
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                    <AlertCircle className="w-6 h-6 text-rose-500" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.kode_qr && (
                                            <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest px-6 animate-in fade-in slide-in-from-top-1">
                                                {errors.kode_qr}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full h-20 rounded-[32px] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                        disabled={processing || !data.kode_qr}
                                    >
                                        {processing ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>Verify Sequence</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-slate-900/10 rounded-[48px] overflow-hidden bg-slate-900 text-white p-10 flex flex-col justify-between relative group min-h-[340px] transition-all duration-700 hover:shadow-rose-500/20">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 blur-[120px] rounded-full group-hover:bg-rose-600/30 transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />

                            <div className="relative z-10 space-y-10">
                                <div className="bg-white/5 w-24 h-24 rounded-[36px] flex items-center justify-center shadow-2xl backdrop-blur-3xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Secure Core</Badge>
                                        <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Security Integrity</h3>
                                    </div>
                                    <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                        Automated systems are synchronized. Real-time logging active. Ensure optimal visibility for sub-200ms verification speed.
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Pulse</p>
                                        <p className="text-emerald-400 font-black italic uppercase tracking-widest text-sm">Online & Secure</p>
                                    </div>
                                    <Scan className="w-12 h-12 text-slate-800 rotate-12" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Scan History Section */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-100 rounded-2xl">
                                <History className="w-6 h-6 text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Log Terbaru</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Real-time throughput analysis</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map((item) => (
                                <Card key={item.id} className="border-none shadow-xl shadow-slate-100/50 rounded-[32px] overflow-hidden bg-white p-6 hover:translate-y-[-4px] transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors duration-300">
                                            <TicketIcon className="w-7 h-7" />
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-slate-100 text-slate-400 mb-1">Authenticated</Badge>
                                            <p className="text-[10px] font-black text-rose-500 font-mono tracking-wider">{item.kode_qr}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Visitor Identity</p>
                                            <h4 className="font-black text-lg text-slate-900 uppercase truncate italic">{item.pemesanan?.user?.nama || 'Unknown User'}</h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
                                                </div>
                                                <p className="text-[11px] font-black text-slate-600">{new Date(item.waktu_scan).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Time</span>
                                                </div>
                                                <p className="text-[11px] font-black text-slate-600">{new Date(item.waktu_scan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center space-y-4">
                                <div className="mx-auto w-24 h-24 bg-slate-50 flex items-center justify-center rounded-[32px]">
                                    <RefreshCw className="w-10 h-10 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No verification history found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[425px] border-none p-0 overflow-hidden rounded-[48px] bg-slate-900 text-white shadow-[0_0_100px_rgba(16,185,129,0.3)]">
                    <div className="relative overflow-hidden p-10">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/10 blur-[60px] rounded-full" />

                        <div className="relative z-10 text-center space-y-8">
                            <div className="mx-auto w-28 h-28 bg-emerald-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-in zoom-in-50 duration-500">
                                <CheckCircle className="w-16 h-16 text-white animate-in slide-in-from-bottom-2" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Verified</h2>
                                <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">Access Granted Successfully</p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ticket Holder</p>
                                    <p className="text-2xl font-black uppercase italic tracking-tight">{lastScanned?.pemesanan?.user?.nama || 'Verified Visitor'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 bg-white/5 p-6 rounded-[32px] border border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">ID Source</p>
                                        <p className="text-sm font-black italic uppercase text-rose-500">{lastScanned?.kode_qr}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verify Time</p>
                                        <p className="text-sm font-black italic uppercase text-emerald-400">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowSuccess(false)}
                                className="w-full h-18 bg-white text-slate-900 hover:bg-slate-100 rounded-[28px] font-black uppercase tracking-widest text-xs"
                            >
                                Continue To Next Scan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={showError} onOpenChange={setShowError}>
                <DialogContent className="sm:max-w-[425px] border-none p-0 overflow-hidden rounded-[48px] bg-slate-900 text-white shadow-[0_0_100px_rgba(244,63,94,0.3)]">
                    <div className="relative overflow-hidden p-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[100px] rounded-full" />

                        <div className="relative z-10 text-center space-y-8">
                            <div className="mx-auto w-28 h-28 bg-rose-600 rounded-[40px] flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-in zoom-in-50 duration-500">
                                <XCircle className="w-16 h-16 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Denied</h2>
                                <p className="text-rose-400 font-black uppercase tracking-[0.3em] text-[10px]">Verification Error</p>
                            </div>

                            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                                <p className="text-slate-300 font-medium leading-relaxed italic text-lg">
                                    "{errorMessage || 'Tiket sudah tidak aktif atau sudah digunakan.'}"
                                </p>
                            </div>

                            <Button
                                onClick={() => setShowError(false)}
                                className="w-full h-18 bg-rose-600 text-white hover:bg-rose-700 rounded-[28px] font-black uppercase tracking-widest text-xs"
                            >
                                Acknowledge & Continue
                            </Button>
                        </div>
                    </div>
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
