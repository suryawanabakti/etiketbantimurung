import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Ticket,
    Timer,
    Info,
    QrCode,
    Download,
    Printer,
    FileText,
    CheckCircle2,
    Calendar,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TicketList from '@/components/landing/ticket-list';
import BookingSummary from '@/components/landing/booking-summary';

interface Tiket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
    tanggal_berlaku: string | null;
}

interface Props {
    stats: any;
    myTickets: {
        data: any[];
    };
    tikets: Tiket[];
    flash: any;
}

export default function VisitorHome({ stats, myTickets, tikets }: Props) {
    const { flash } = usePage<any>().props;
    const [selectedTiket, setSelectedTiket] = useState<Tiket | null>(null);
    const [jumlah, setJumlah] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showQr, setShowQr] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState<any>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleBooking = () => {
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

    useEffect(() => {
        if (flash.snapToken) {
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
        if (flash.error) alert(flash.error);
    }, [flash]);

    return (
        <div className="pb-24 pt-32 bg-slate-50 min-h-screen">
            <Head title="Beranda Pengunjung" />

            <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16 md:space-y-24">

                {/* Booking Section */}
                <section id="tickets" className="space-y-8 md:space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">Beli Tiket Baru</h2>
                            <p className="text-muted-foreground">Pilih tiket liburan Anda</p>
                        </div>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-3 items-start">
                        <div className="lg:col-span-2">
                            <TicketList
                                tikets={tikets}
                                selectedTiket={selectedTiket}
                                onSelectTiket={setSelectedTiket}
                                formatCurrency={formatCurrency}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <BookingSummary
                                selectedTiket={selectedTiket}
                                jumlah={jumlah}
                                setJumlah={setJumlah}
                                loading={loading}
                                handleBooking={handleBooking}
                                formatCurrency={formatCurrency}
                            />
                        </div>
                    </div>
                </section>

                {/* My Tickets Section */}
                <section id="my-tickets" className="space-y-8 md:space-y-12 pt-16 md:pt-24 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">Riwayat & Tiket Aktif</h2>
                            <p className="text-muted-foreground">Daftar tiket yang Anda miliki</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-background px-4 py-2 rounded-lg shadow-sm border flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground">Aktif</span>
                                <span className="text-xl font-bold text-primary">{stats.tiket_aktif}</span>
                            </div>
                            <div className="bg-background px-4 py-2 rounded-lg shadow-sm border flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground">Total</span>
                                <span className="text-xl font-bold">{stats.total_pesanan}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        {myTickets.data.map((order) => (
                            <Card key={order.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className={`p-6 md:w-64 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 ${order.status_pemesanan === 'paid' ? 'bg-primary/5 border-b md:border-b-0 md:border-r' : 'bg-muted/50 border-b md:border-b-0 md:border-r'}`}>
                                        <div className={`p-4 rounded-full ${order.status_pemesanan === 'paid' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            <Ticket className="w-8 h-8" />
                                        </div>
                                        <div className="text-right md:text-center">
                                            <Badge variant={order.status_pemesanan === 'paid' ? 'default' : 'secondary'}>
                                                {order.status_pemesanan === 'paid' ? 'Aktif' : order.status_pemesanan}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 md:p-8 flex flex-col md:grid md:grid-cols-2 gap-6 items-center">
                                        <div className="space-y-3 text-center md:text-left w-full">
                                            <h3 className="text-xl font-bold tracking-tight">{order.tiket.nama_tiket}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-1"><Info className="w-4 h-4" /> #{order.id}</span>
                                                <Badge variant="outline">{order.jumlah_tiket} Orang</Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-4 text-center md:text-right w-full">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Total Transaksi</p>
                                                <p className="text-2xl font-bold">{formatCurrency(order.jumlah_tiket * order.tiket.harga)}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                                {order.status_pemesanan === 'pending' && (
                                                    <Button
                                                        variant="default"
                                                        className="w-full sm:w-auto"
                                                        onClick={() => router.post(`/booking/${order.id}/pay`, {}, { preserveScroll: true })}
                                                    >
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                        Bayar Sekarang
                                                    </Button>
                                                )}
                                                {order.status_pemesanan === 'paid' && order.tiket_qr && (
                                                    <Button
                                                        variant={order.tiket_qr.status_tiket === 'aktif' ? "default" : "secondary"}
                                                        className="w-full sm:w-auto"
                                                        onClick={() => setShowQr(order)}
                                                        disabled={order.tiket_qr.status_tiket !== 'aktif'}
                                                    >
                                                        <QrCode className="w-4 h-4 mr-2" />
                                                        {order.tiket_qr.status_tiket === 'aktif' ? 'Lihat QR' : 'Terpakai'}
                                                    </Button>
                                                )}
                                                {order.status_pemesanan === 'paid' && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full sm:w-auto"
                                                        onClick={() => router.visit(`/invoice/${order.id}`)}
                                                    >
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        Invoice
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {myTickets.data.length === 0 && (
                        <div className="py-24 text-center rounded-[60px] border-4 border-dashed border-slate-200 bg-white shadow-inner">
                            <div className="bg-slate-50 w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-100">
                                <Ticket className="w-12 h-12 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic">Riwayat Masih Kosong</h3>
                            <p className="text-slate-400 text-lg max-w-sm mx-auto mb-10 font-medium">Anda belum memiliki riwayat pemesanan. Mulai petualangan Anda sekarang juga!</p>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-10 h-14 rounded-full shadow-2xl shadow-red-900/20"
                                onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Pesan Sekarang
                            </Button>
                        </div>
                    )}
                </section>
            </div>

            {/* QR Modal */}
            <Dialog open={!!showQr} onOpenChange={() => setShowQr(null)}>
                <DialogContent className="sm:max-w-sm rounded-xl">
                    <DialogHeader className="pt-8 px-6 text-center text-primary">
                        <DialogTitle className="text-2xl font-bold tracking-tight">E-Tiket Wisata</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Tunjukkan QR Code ini pada saat masuk.
                        </DialogDescription>
                    </DialogHeader>
                    {showQr && (
                        <div className="flex flex-col items-center justify-center p-6 space-y-6">
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${showQr.tiket_qr.kode_qr}`}
                                    alt="QR Code Tiket"
                                    className="w-64 h-64"
                                />
                            </div>

                            <div className="text-center space-y-2">
                                <div className="bg-muted py-2 px-6 rounded-md">
                                    <p className="font-mono text-xl font-bold tracking-widest">{showQr.tiket_qr.kode_qr}</p>
                                </div>
                                <div className="pt-2">
                                    <p className="font-bold">{showQr.tiket.nama_tiket}</p>

                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full border-t pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${showQr.tiket_qr.kode_qr}`, '_blank')}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    PNG
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Cetak
                                </Button>
                                <Button
                                    className="col-span-2 w-full"
                                    onClick={() => router.visit(`/invoice/${showQr.id}`)}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Detail Invoice
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[480px] rounded-[48px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <div className="p-12 text-center space-y-8">
                        <div className="relative inline-flex">
                            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 animate-pulse" />
                            <div className="relative bg-emerald-500 p-6 rounded-[32px] text-white shadow-2xl shadow-emerald-200">
                                <CheckCircle2 className="w-16 h-16 stroke-[2.5]" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Pembayaran Berhasil!</h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
                                Tiket Anda telah aktif. Silakan cek riwayat tiket untuk melihat QR Code masuk.
                            </p>
                        </div>

                        <div className="grid gap-4 w-full">
                            <Button
                                className="w-full h-16 rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"

                            >
                                <Ticket className="w-5 h-5" />
                                Lihat Tiket Saya
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full h-14 rounded-[24px] text-slate-400 font-black uppercase tracking-widest hover:text-red-600 hover:bg-red-50 transition-all"
                                onClick={() => setShowSuccess(false)}
                            >
                                Selesai
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
