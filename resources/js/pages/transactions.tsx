import { type BreadcrumbItem } from '@/types';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Transaksi',
        href: '/transactions',
    },
];

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Transaksi</h1>
                        <p className="text-sm text-muted-foreground">Pantau dan kelola pemesanan tiket pengunjung</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="bg-muted/30 border-b p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, email, atau ID..."
                                    className="pl-9 bg-background"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Select value={status} onValueChange={(val) => setStatus(val)}>
                                    <SelectTrigger className="w-full md:w-[200px] bg-background">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="secondary" onClick={handleFilter}>
                                    <Filter className="w-4 h-4 mr-2" /> Filter Data
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">ID & Status</th>
                                        <th className="px-4 py-3 font-medium">Pengunjung</th>
                                        <th className="px-4 py-3 font-medium">Item Tiket</th>
                                        <th className="px-4 py-3 font-medium text-right">Total Bayar</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => setSelectedTransaction(transaction)}>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className="text-xs font-mono text-muted-foreground">#{transaction.id}</span>
                                                    <Badge
                                                        variant={transaction.status_pemesanan === 'paid' ? "default" : transaction.status_pemesanan === 'pending' ? "secondary" : "destructive"}
                                                        className="w-fit text-[10px]"
                                                    >
                                                        {transaction.status_pemesanan.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{transaction.user.nama}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{transaction.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-foreground text-sm">{transaction.tiket.nama_tiket}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                                    <span className="bg-muted px-1.5 py-0.5 rounded-sm">{transaction.jumlah_tiket} Tiket</span>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span>{new Date(transaction.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="font-medium text-foreground">{formatCurrency(transaction.jumlah_tiket * transaction.tiket.harga)}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Via Midtrans Snap</div>
                                            </td>
                                            <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-end gap-2">
                                                    {transaction.status_pemesanan === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            onClick={(e) => { e.stopPropagation(); handleApprove(transaction.id); }}
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Approve
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        onClick={(e) => { e.stopPropagation(); setSelectedTransaction(transaction); }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    
                    <div className="flex justify-between items-center px-4 py-4 md:px-6 bg-muted/10 border-t">
                        <span className="text-sm text-muted-foreground mr-4">Total: {transactions.data.length} transaksi</span>
                        {transactions.links.length > 3 && (
                            <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                                {transactions.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        className={`min-w-9 ${link.active ? '' : 'text-muted-foreground'}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Transaction Detail Sheet */}
                <Sheet open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
                    <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                        {selectedTransaction && (
                            <div className="flex flex-col h-full">
                                <SheetHeader className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={selectedTransaction.status_pemesanan === 'paid' ? "default" : selectedTransaction.status_pemesanan === 'pending' ? "secondary" : "destructive"}>
                                            {selectedTransaction.status_pemesanan.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <SheetTitle>Detail Transaksi</SheetTitle>
                                    <SheetDescription>
                                        ID PESANAN: #{selectedTransaction.id}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="space-y-6 flex-1">
                                    <div className="grid gap-6">
                                        {/* User Info */}
                                        <Card>
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground">Informasi Pengunjung</p>
                                                    <h4 className="font-semibold text-foreground leading-none">{selectedTransaction.user.nama}</h4>
                                                    <p className="text-sm font-medium text-muted-foreground">{selectedTransaction.user.email}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Ticket Details */}
                                        <Card>
                                            <CardContent className="p-4 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                                        <TicketIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Rincian Pesanan</p>
                                                        <h4 className="font-semibold text-foreground leading-none">{selectedTransaction.tiket.nama_tiket}</h4>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Jumlah</p>
                                                        <p className="font-medium text-foreground">{selectedTransaction.jumlah_tiket} Tiket</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Harga Satuan</p>
                                                        <p className="font-medium text-foreground">{formatCurrency(selectedTransaction.tiket.harga)}</p>
                                                    </div>
                                                    <div className="col-span-2 pt-4 border-t mt-2">
                                                        <p className="text-xs text-muted-foreground">Total Pembayaran</p>
                                                        <p className="font-bold text-xl text-foreground mt-1">
                                                            {formatCurrency(selectedTransaction.jumlah_tiket * selectedTransaction.tiket.harga)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Status Qr */}
                                        <Card>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                                        <QrCode className="w-5 h-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Status Kode QR</p>
                                                        <h4 className="font-semibold text-foreground leading-none">
                                                            {selectedTransaction.tiket_qr ? 'TERSEDIA' : 'MENUNGGU'}
                                                        </h4>
                                                    </div>
                                                </div>
                                                {selectedTransaction.tiket_qr && (
                                                    <Badge variant="outline" className="font-mono">
                                                        {selectedTransaction.tiket_qr.kode_qr}
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="pt-6 flex gap-3 pb-6">
                                        <Button
                                            className="flex-1"
                                            variant="outline"
                                            onClick={() => router.visit(`/invoice/${selectedTransaction.id}`)}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" /> Lihat Invoice
                                        </Button>
                                        {selectedTransaction.status_pemesanan === 'pending' && (
                                            <Button
                                                className="flex-1"
                                                onClick={() => handleApprove(selectedTransaction.id)}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
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
