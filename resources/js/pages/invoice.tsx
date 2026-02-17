import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft, Ticket, Calendar, User, CreditCard, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
    pemesanan: any;
}

export default function Invoice({ pemesanan }: Props) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSaveQR = async () => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${pemesanan.tiket_qr.kode_qr}`;
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `QR_Bantimurung_${pemesanan.tiket_qr.kode_qr}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download QR code:', error);
            // Fallback: Open in new tab
            window.open(qrUrl, '_blank');
        }
    };

    const invoiceNo = `INV-${pemesanan.id}-${new Date(pemesanan.created_at).getTime().toString().slice(-6)}`.toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-12 flex flex-col items-center font-sans">
            <Head title={`Invoice ${invoiceNo}`} />

            {/* Top Toolbar */}
            <div className="max-w-4xl w-full flex justify-between items-center mb-8 print:hidden">
                <Button variant="ghost" className="rounded-2xl font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-colors" onClick={() => router.visit("/dashboard")}>
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Kembali
                </Button>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50" onClick={handlePrint}>
                        <Printer className="w-5 h-5 mr-3" />
                        Cetak
                    </Button>

                </div>
            </div>

            {/* Main Invoice Card */}
            <div className="max-w-4xl w-full bg-white shadow-2xl rounded-[48px] overflow-hidden print:shadow-none print:rounded-none border border-slate-100 flex flex-col md:flex-row">

                {/* Left Side: QR & Ticket Info */}
                <div className="md:w-[350px] bg-slate-900 p-10 md:p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

                    <div className="relative z-10 mb-8">
                        <div className="bg-rose-600 p-4 rounded-[32px] inline-flex mb-6 shadow-2xl shadow-rose-900/40">
                            <Ticket className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">E-Tiket <br /><span className="text-rose-500">Bantimurung</span></h2>
                    </div>

                    <div className="relative z-10 p-6 bg-white rounded-[40px] shadow-2xl mb-8 group transition-transform hover:scale-105 duration-500">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${pemesanan.tiket_qr.kode_qr}`}
                            alt="QR Code"
                            className="w-48 h-48 md:w-56 md:h-56"
                        />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Kode Tiket Pas</p>
                        <p className="text-2xl font-mono font-black tracking-[0.2em] italic uppercase">{pemesanan.tiket_qr.kode_qr}</p>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 opacity-20 hidden md:block">
                        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 rotate-90 origin-left absolute bottom-12 left-12 whitespace-nowrap">Bantimurung Nature Park</p>
                    </div>
                </div>

                {/* Right Side: Invoice Details */}
                <div className="flex-1 p-10 md:p-16 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-12 border-b border-slate-100">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Nomor Invoice</p>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">#{invoiceNo}</h1>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-600 border-none font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] text-[10px]">Lunas / Paid</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    <User className="w-3 h-3 text-rose-500" /> Pengunjung
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-slate-900 uppercase italic leading-none">{pemesanan.user.nama}</p>
                                    <p className="text-slate-500 font-bold">{pemesanan.user.email}</p>
                                    <p className="text-slate-500 font-bold">{pemesanan.user.no_hp || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    <Calendar className="w-3 h-3 text-rose-500" /> Tanggal Transaksi
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-slate-900 uppercase italic leading-none">
                                        {new Date(pemesanan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-slate-500 font-bold">{new Date(pemesanan.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 pb-2 border-b border-slate-50">
                            <CreditCard className="w-3 h-3 text-rose-500" /> Detail Pesanan
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-slate-900 uppercase italic leading-none">{pemesanan.tiket.nama_tiket}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tiket Masuk Wahana & Alam</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900 leading-none">{pemesanan.jumlah_tiket} Orang</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{formatCurrency(pemesanan.tiket.harga)} / Pax</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 border-t-4 border-rose-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Total Nilai Transaksi</p>
                            <h4 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                                {formatCurrency(pemesanan.tiket.harga * pemesanan.jumlah_tiket)}
                            </h4>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                                Terverifikasi Aman <br /><span className="text-emerald-600">Sistem E-Tiket BTM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center space-y-2 opacity-40">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Selamat Menikmati Keindahan Alam Maros</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ini adalah dokumen elektronik sah dari Taman Nasional Bantimurung</p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background-color: white !important; }
                    .bg-slate-50 { background-color: white !important; }
                    .shadow-2xl { box-shadow: none !important; }
                    .p-12 { padding: 0 !important; }
                    .min-h-screen { background-color: white !important; padding: 0 !important; }
                    .md\\:w-\\[350px\\] { background-color: #0f172a !important; -webkit-print-color-adjust: exact; }
                    .bg-rose-600 { background-color: #e11d48 !important; -webkit-print-color-adjust: exact; }
                    .text-white { color: white !important; -webkit-print-color-adjust: exact; }
                    .border-rose-600 { border-color: #e11d48 !important; -webkit-print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
}
