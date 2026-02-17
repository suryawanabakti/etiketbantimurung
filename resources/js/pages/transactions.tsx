import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Search,
    Filter,
    CheckCircle2,
    ExternalLink,
    Eye,
    User,
    Ticket as TicketIcon,
    CreditCard,
    Calendar,
    Clock,
    QrCode,
    ReceiptText,
    ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    transactions: {
        data: any[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function Transactions({ transactions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

    const handleFilter = () => {
        router.get('/transactions', { search, status }, { preserveState: true, replace: true });
    };

    const handleApprove = (id: number) => {
        if (confirm('Setujui transaksi ini secara manual?')) {
            router.post(`/transactions/${id}/approve`);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Transaksi" />

            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Manajemen Transaksi</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pantau dan kelola pemesanan tiket pengunjung</p>
                    </div>
                </div>

                <Card className="">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    placeholder="Cari nama, email, atau ID..."
                                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select value={status} onValueChange={(val) => setStatus(val)}>
                                    <SelectTrigger className="h-14 w-full md:w-[200px] rounded-2xl bg-white border-slate-100">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="h-14 bg-slate-900 text-white rounded-2xl px-10 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-slate-200" onClick={handleFilter}>
                                    <Filter className="w-4 h-4 mr-2" /> Filter Data
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-50/30 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] border-b border-slate-100">
                                    <tr>
                                        <th className="px-10 py-6">ID & Status</th>
                                        <th className="px-10 py-6">Pengunjung</th>
                                        <th className="px-10 py-6">Item Tiket</th>
                                        <th className="px-10 py-6 text-right">Total Bayar</th>
                                        <th className="px-10 py-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedTransaction(transaction)}>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-mono font-black text-slate-300">#{transaction.id}</span>
                                                    <Badge
                                                        className={`font-black uppercase tracking-widest px-3 py-1 rounded-full text-[8px] w-fit shadow-sm ${transaction.status_pemesanan === 'paid' ? 'bg-emerald-100 text-emerald-600 border-none' :
                                                            transaction.status_pemesanan === 'pending' ? 'bg-orange-100 text-orange-600 border-none' :
                                                                'bg-rose-100 text-rose-600 border-none'
                                                            }`}
                                                    >
                                                        {transaction.status_pemesanan === 'paid' ? 'PAID' :
                                                            transaction.status_pemesanan === 'pending' ? 'PENDING' : 'CANCELLED'}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <div className="font-black text-slate-900 uppercase italic leading-tight text-lg group-hover:text-rose-600 transition-colors">{transaction.user.nama}</div>
                                                    <div className="text-xs text-slate-400 mt-1 font-bold">{transaction.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="font-black text-slate-700 uppercase italic text-sm">{transaction.tiket.nama_tiket}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 flex items-center gap-2">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{transaction.jumlah_tiket} Tiket</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span>{new Date(transaction.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(transaction.jumlah_tiket * transaction.tiket.harga)}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Via Midtrans Snap</div>
                                            </td>
                                            <td className="px-10 py-8 text-right" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-end gap-3">
                                                    {transaction.status_pemesanan === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                                                            onClick={(e) => { e.stopPropagation(); handleApprove(transaction.id); }}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-10 w-10 p-0 shadow-sm border border-slate-100"
                                                        onClick={(e) => { e.stopPropagation(); setSelectedTransaction(transaction); }}
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction Detail Sheet */}
                <Sheet open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
                    <SheetContent className="w-full sm:max-w-xl border-none p-0 overflow-y-auto">
                        {selectedTransaction && (
                            <div className="flex flex-col h-full bg-slate-50 font-sans">
                                <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 blur-[80px] rounded-full" />
                                    <SheetHeader className="relative z-10 text-left">
                                        <Badge className={`w-fit mb-6 font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-[10px] ${selectedTransaction.status_pemesanan === 'paid' ? 'bg-emerald-500 text-white' :
                                                selectedTransaction.status_pemesanan === 'pending' ? 'bg-orange-500 text-white' :
                                                    'bg-rose-500 text-white'
                                            }`}>
                                            {selectedTransaction.status_pemesanan === 'paid' ? 'PAID' :
                                                selectedTransaction.status_pemesanan === 'pending' ? 'PENDING' : 'CANCELLED'}
                                        </Badge>
                                        <SheetTitle className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                                            Detail Transaksi
                                        </SheetTitle>
                                        <SheetDescription className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
                                            ID PESANAN: #{selectedTransaction.id}
                                        </SheetDescription>
                                    </SheetHeader>
                                </div>

                                <div className="p-8 space-y-6 flex-1 relative -mt-8 bg-slate-50 rounded-t-[40px] z-20">
                                    <div className="grid gap-6">
                                        {/* User Info */}
                                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
                                            <CardContent className="p-8 flex items-center gap-6">
                                                <div className="bg-slate-900 p-4 rounded-2xl text-white">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Informasi Pengunjung</p>
                                                    <h4 className="font-black text-slate-900 uppercase italic text-xl leading-none">{selectedTransaction.user.nama}</h4>
                                                    <p className="text-sm font-bold text-slate-500">{selectedTransaction.user.email}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Ticket Details */}
                                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
                                            <CardContent className="p-8 space-y-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-rose-600 p-4 rounded-2xl text-white">
                                                        <TicketIcon className="w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rincian Pesanan</p>
                                                        <h4 className="font-black text-slate-900 uppercase italic text-xl leading-none">{selectedTransaction.tiket.nama_tiket}</h4>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jumlah</p>
                                                        <p className="font-black text-slate-900 text-lg italic uppercase">{selectedTransaction.jumlah_tiket} Tiket</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Satuan</p>
                                                        <p className="font-black text-slate-900 text-lg italic uppercase">{formatCurrency(selectedTransaction.tiket.harga)}</p>
                                                    </div>
                                                    <div className="space-y-1 col-span-2 pt-4 border-t border-slate-50 mt-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pembayaran</p>
                                                        <p className="font-black text-rose-600 text-3xl tracking-tighter italic leading-none">
                                                            {formatCurrency(selectedTransaction.jumlah_tiket * selectedTransaction.tiket.harga)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Status Qr */}
                                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
                                            <CardContent className="p-8 flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-emerald-500 p-4 rounded-2xl text-white">
                                                        <QrCode className="w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Kode QR</p>
                                                        <h4 className="font-black text-slate-900 uppercase italic text-lg leading-none">
                                                            {selectedTransaction.tiket_qr ? 'TERSEDIA' : 'MENUNGGU'}
                                                        </h4>
                                                    </div>
                                                </div>
                                                {selectedTransaction.tiket_qr && (
                                                    <Badge className="bg-slate-100 text-slate-600 font-mono font-bold border-none px-3 py-1">
                                                        {selectedTransaction.tiket_qr.kode_qr}
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="pt-10 flex gap-4">
                                        <Button
                                            className="flex-1 h-16 rounded-[24px] bg-slate-900 text-white font-black uppercase tracking-widest text-xs"
                                            onClick={() => router.visit(`/invoice/${selectedTransaction.id}`)}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" /> Lihat Invoice
                                        </Button>
                                        {selectedTransaction.status_pemesanan === 'pending' && (
                                            <Button
                                                className="flex-1 h-16 rounded-[24px] bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 hover:scale-105 transition-all"
                                                onClick={() => handleApprove(selectedTransaction.id)}
                                            >
                                                Approve Sekarang
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
