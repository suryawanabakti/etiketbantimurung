import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Activity, CreditCard, Users, TrendingUp, Search } from 'lucide-react';

interface Stats {
    total_tiket_terjual: number;
    total_pendapatan: number;
    total_pengunjung: number;
    transaksi_terakhir: any[];
}

interface Props {
    stats: Stats;
    transactions: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function AdminDashboard({ stats, transactions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, status]);

    const handleFilter = () => {
        router.get(
            '/dashboard',
            { search, status: status === 'all' ? undefined : status },
            { preserveState: true, replace: true }
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
                        <TrendingUp className="w-4 h-4 text-blue-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_tiket_terjual}</div>
                        <p className="text-xs text-blue-100 opacity-80">Total semua tiket lunas</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
                        <CreditCard className="w-4 h-4 text-emerald-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.total_pendapatan)}</div>
                        <p className="text-xs text-emerald-100 opacity-80">Total pembayaran berhasil</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-500 to-violet-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Pengunjung</CardTitle>
                        <Users className="w-4 h-4 text-violet-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_pengunjung}</div>
                        <p className="text-xs text-violet-100 opacity-80">Terdaftar di sistem</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Aktivitas</CardTitle>
                        <Activity className="w-4 h-4 text-orange-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Live</div>
                        <p className="text-xs text-orange-100 opacity-80">Sistem berjalan normal</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                <CardHeader className="bg-muted/50 border-b border-sidebar-border/70">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold">Tabel Transaksi</CardTitle>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pengunjung..."
                                    className="pl-9 w-full md:w-[250px] bg-background"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full md:w-[150px] bg-background">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-sidebar-border/70">
                                <tr>
                                    <th className="px-6 py-4">No. Pesanan</th>
                                    <th className="px-6 py-4">Pengunjung</th>
                                    <th className="px-6 py-4">Tiket</th>
                                    <th className="px-6 py-4">Jumlah</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70">
                                {transactions.data.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium">#{transaction.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{transaction.user.nama}</div>
                                            <div className="text-xs text-muted-foreground">{transaction.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">{transaction.tiket.nama_tiket}</td>
                                        <td className="px-6 py-4 text-center">{transaction.jumlah_tiket}</td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatCurrency(transaction.jumlah_tiket * transaction.tiket.harga)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    transaction.status_pemesanan === 'paid' ? 'default' :
                                                        transaction.status_pemesanan === 'pending' ? 'outline' : 'destructive'
                                                }
                                                className={
                                                    transaction.status_pemesanan === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' : ''
                                                }
                                            >
                                                {transaction.status_pemesanan}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                                            Tidak ada data transaksi ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {transactions.last_page > 1 && (
                        <div className="p-4 border-t border-sidebar-border/70 flex justify-end gap-2">
                            {/* Pagination would go here, using simple buttons for now */}
                            <button
                                onClick={() => router.get(transactions.links[0].url)}
                                disabled={!transactions.links[0].url}
                                className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => router.get(transactions.links[transactions.links.length - 1].url)}
                                disabled={!transactions.links[transactions.links.length - 1].url}
                                className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
