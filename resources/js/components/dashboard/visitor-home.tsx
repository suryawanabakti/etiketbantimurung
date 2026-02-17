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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div className="space-y-2 md:space-y-3">
                            <Badge className="bg-rose-100 text-rose-600 border-none font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px]">Pemesanan Tiket</Badge>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Beli Tiket Baru</h2>
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                        <div className="space-y-2 md:space-y-3">
                            <Badge className="bg-emerald-100 text-emerald-600 border-none font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px]">Tiket Anda</Badge>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Riwayat & Tiket Aktif</h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                                <span className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Aktif</span>
                                <span className="text-xl md:text-2xl font-black text-emerald-600">{stats.tiket_aktif}</span>
                            </div>
                            <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                                <span className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Total</span>
                                <span className="text-xl md:text-2xl font-black text-slate-900">{stats.total_pesanan}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        {myTickets.data.map((order) => (
                            <Card key={order.id} className="rounded-[32px] md:rounded-[40px] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white group transition-all hover:scale-[1.01]">
                                <div className="flex flex-col md:flex-row">
                                    <div className={`p-8 md:p-10 md:w-64 lg:w-72 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 ${order.status_pemesanan === 'paid' ? 'bg-emerald-50 text-emerald-600 border-b md:border-b-0 md:border-r border-emerald-100' : 'bg-slate-50 text-slate-400 border-b md:border-b-0 md:border-r border-slate-100'}`}>
                                        <div className={`p-4 md:p-6 rounded-2xl md:rounded-[32px] ${order.status_pemesanan === 'paid' ? 'bg-emerald-100 shadow-xl shadow-emerald-200' : 'bg-slate-100'}`}>
                                            <Ticket className="w-8 h-8 md:w-12 md:h-12 stroke-[2.5]" />
                                        </div>
                                        <div className="text-right md:text-center">
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] italic block mb-1">Status Tiket</span>
                                            <Badge className={`font-black uppercase tracking-widest px-3 py-1 rounded-full text-[10px] ${order.status_pemesanan === 'paid' ? 'bg-emerald-600' : 'bg-slate-400'}`}>
                                                {order.status_pemesanan === 'paid' ? 'Aktif' : order.status_pemesanan}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 md:p-10 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10 items-center">
                                        <div className="space-y-4 text-center md:text-left w-full">
                                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic">{order.tiket.nama_tiket}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs text-slate-400 font-bold">
                                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"><Timer className="w-3 h-3 text-rose-500" /> {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"><Info className="w-3 h-3 text-rose-500" /> ID #{order.id}</span>
                                                <Badge className="bg-slate-900 text-white rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">{order.jumlah_tiket} Orang</Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-4 text-center md:text-right w-full">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Total Transaksi</p>
                                                <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(order.jumlah_tiket * order.tiket.harga)}</p>
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                                {order.status_pemesanan === 'pending' && (
                                                    <Button
                                                        className="flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-8 h-12 md:h-14 font-black uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-white shadow-2xl shadow-amber-200 transition-all"
                                                        onClick={() => router.post(`/booking/${order.id}/pay`, {}, { preserveScroll: true })}
                                                    >
                                                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2 stroke-[2.5]" />
                                                        Bayar Sekarang
                                                    </Button>
                                                )}
                                                {order.status_pemesanan === 'paid' && order.tiket_qr && (
                                                    <Button
                                                        className={`flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-8 h-12 md:h-14 font-black uppercase tracking-widest shadow-2xl transition-all ${order.tiket_qr.status_tiket === 'aktif' ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200' : 'bg-slate-100 text-slate-400'}`}
                                                        onClick={() => setShowQr(order)}
                                                        disabled={order.tiket_qr.status_tiket !== 'aktif'}
                                                    >
                                                        <QrCode className="w-4 h-4 md:w-5 md:h-5 mr-2 stroke-[2.5]" />
                                                        {order.tiket_qr.status_tiket === 'aktif' ? 'Lihat QR' : 'Terpakai'}
                                                    </Button>
                                                )}
                                                {order.status_pemesanan === 'paid' && (
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-8 h-12 md:h-14 font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
                                                        onClick={() => router.visit(`/invoice/${order.id}`)}
                                                    >
                                                        <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 stroke-[2.5] text-rose-500" />
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
                                className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest px-10 h-14 rounded-full shadow-2xl shadow-rose-900/20"
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
                <DialogContent className="sm:max-w-md rounded-[48px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-10 bg-rose-600 text-white rounded-t-[48px] text-center">
                        <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic">E-Tiket Wisata</DialogTitle>
                        <DialogDescription className="text-rose-100 text-lg font-medium mt-2">
                            Tunjukkan QR Code ini pada mesin scan loket.
                        </DialogDescription>
                    </DialogHeader>
                    {showQr && (
                        <div className="flex flex-col items-center p-10 space-y-10">
                            <div className="p-8 bg-slate-50 rounded-[56px] shadow-inner border-4 border-slate-100 relative group overflow-hidden">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${showQr.tiket_qr.kode_qr}`}
                                    alt="QR Code Tiket"
                                    className="w-72 h-72 relative z-10 transition-transform group-hover:scale-105 duration-500"
                                />
                            </div>

                            <div className="text-center w-full space-y-6">
                                <div className="bg-slate-900 py-4 rounded-3xl shadow-2xl">
                                    <p className="font-mono text-3xl font-black tracking-[0.4em] text-white pl-[0.4em] uppercase italic">{showQr.tiket_qr.kode_qr}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{showQr.tiket.nama_tiket}</p>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Berlaku untuk {showQr.jumlah_tiket} orang pemegang tiket</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t-2 border-slate-50">
                                <Button
                                    variant="outline"
                                    className="h-16 rounded-[24px] border-slate-200 text-slate-600 font-black uppercase tracking-widest hover:bg-slate-50"
                                    onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${showQr.tiket_qr.kode_qr}`, '_blank')}
                                >
                                    <Download className="w-5 h-5 mr-3 text-rose-600" />
                                    PNG
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-16 rounded-[24px] border-slate-200 text-slate-600 font-black uppercase tracking-widest hover:bg-slate-50"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-5 h-5 mr-3 text-rose-600" />
                                    Cetak
                                </Button>
                                <Button
                                    className="w-full col-span-2 h-16 rounded-[24px] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                                    onClick={() => router.visit(`/invoice/${showQr.id}`)}
                                >
                                    <FileText className="w-5 h-5 text-rose-500" />
                                    Detail Invoice
                                </Button>
                            </div>

                            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] text-center max-w-[240px]">
                                Sistem Verifikasi E-Tiket Elektronik <br />Bantimurung Maros
                            </p>
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
                                className="w-full h-16 rounded-[24px] bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"

                            >
                                <Ticket className="w-5 h-5" />
                                Lihat Tiket Saya
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full h-14 rounded-[24px] text-slate-400 font-black uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 transition-all"
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
