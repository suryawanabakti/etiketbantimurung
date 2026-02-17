import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Ticket, History, Timer, Info, QrCode, Plus, Printer, Download, FileText } from 'lucide-react';

interface Stats {
    tiket_aktif: number;
    total_pesanan: number;
}

interface Props {
    stats: Stats;
    myTickets: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
    };
}

export default function PengunjungDashboard({ stats, myTickets, filters }: Props) {
    const [status, setStatus] = useState(filters.status || 'all');
    const [showQr, setShowQr] = useState<any>(null);

    const handleFilter = (val: string) => {
        setStatus(val);
        router.get(
            '/dashboard',
            { status: val === 'all' ? undefined : val },
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
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tiket Aktif</CardTitle>
                        <Ticket className="w-4 h-4 text-rose-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tiket_aktif}</div>
                        <p className="text-xs text-rose-100 opacity-80">Siap digunakan untuk masuk</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                        <History className="w-4 h-4 text-amber-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_pesanan}</div>
                        <p className="text-xs text-amber-100 opacity-80">Semua riwayat pesanan Anda</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                <CardHeader className="bg-muted/50 border-b border-sidebar-border/70">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-rose-500" />
                            E-Tiket Saya
                        </CardTitle>
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <Button variant="outline" className="w-full md:w-auto text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => router.visit('/booking')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Pesan Tiket Baru
                            </Button>
                            <Select value={status} onValueChange={handleFilter}>
                                <SelectTrigger className="w-full md:w-[180px] bg-background">
                                    <SelectValue placeholder="Semua Pesanan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Pesanan</SelectItem>
                                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                                    <SelectItem value="lunas">Lunas (E-Tiket Tersedia)</SelectItem>
                                    <SelectItem value="batal">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid gap-4">
                        {myTickets.data.map((order) => (
                            <div key={order.id} className="group relative overflow-hidden rounded-xl border border-sidebar-border/70 p-4 hover:border-rose-200 hover:bg-rose-50/10 transition-all dark:hover:bg-rose-500/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${order.status_pemesanan === 'lunas' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-muted text-muted-foreground'}`}>
                                            <Ticket className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{order.tiket.nama_tiket}</h3>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1 font-mono">#{order.id}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Timer className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                </span>
                                                <span>•</span>
                                                <span className="font-semibold text-foreground">{order.jumlah_tiket} Tiket</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-xl font-bold">{formatCurrency(order.jumlah_tiket * order.tiket.harga)}</div>
                                        <Badge
                                            variant={order.status_pemesanan === 'lunas' ? 'default' : 'outline'}
                                            className={order.status_pemesanan === 'lunas' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                                        >
                                            {order.status_pemesanan === 'lunas' ? 'Lunas / Aktif' : order.status_pemesanan}
                                        </Badge>
                                    </div>
                                </div>
                                {order.status_pemesanan === 'lunas' && order.tiket_qr && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-sidebar-border/70 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Info className="w-3 h-3" />
                                            {order.tiket_qr.status_tiket === 'aktif' ? 'Tunjukkan QR Code ini kepada petugas di pintu masuk.' : 'Tiket ini sudah digunakan.'}
                                        </div>
                                        <Button
                                            variant={order.tiket_qr.status_tiket === 'aktif' ? 'default' : 'secondary'}
                                            className={order.tiket_qr.status_tiket === 'aktif' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                                            disabled={order.tiket_qr.status_tiket !== 'aktif'}
                                            onClick={() => setShowQr(order)}
                                        >
                                            <QrCode className="w-4 h-4 mr-2" />
                                            {order.tiket_qr.status_tiket === 'aktif' ? 'Lihat QR Code' : 'Sudah Digunakan'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {myTickets.data.length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                                <History className="w-12 h-12 text-muted-foreground/30" />
                                <div className="text-muted-foreground">Anda belum memiliki riwayat pesanan tiket.</div>
                                <Button variant="link" onClick={() => router.visit('/booking')} className="text-rose-600 font-semibold hover:underline">
                                    Pesan Tiket Sekarang
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!showQr} onOpenChange={() => setShowQr(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold">E-Tiket Bantimurung</DialogTitle>
                        <DialogDescription className="text-center">
                            Tunjukkan kode QR ini kepada petugas loket.
                        </DialogDescription>
                    </DialogHeader>
                    {showQr && (
                        <div className="flex flex-col items-center justify-center p-6 space-y-6">
                            <div className="p-4 bg-white rounded-2xl shadow-md border border-sidebar-border/30">
                                <img
                                    id="qr-code-image"
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${showQr.tiket_qr.kode_qr}`}
                                    alt="QR Code Tiket"
                                    className="w-64 h-64"
                                />
                            </div>
                            <div className="text-center bg-muted/30 p-4 rounded-xl w-full">
                                <p className="font-mono text-xl font-bold tracking-widest text-primary mb-1">{showQr.tiket_qr.kode_qr}</p>
                                <p className="text-sm font-semibold">{showQr.tiket.nama_tiket}</p>
                                <p className="text-xs text-muted-foreground">Berlaku untuk {showQr.jumlah_tiket} orang</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${showQr.tiket_qr.kode_qr}`;
                                        link.download = `tiket-${showQr.tiket_qr.kode_qr}.png`;
                                        link.target = "_blank";
                                        link.click();
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Simpan QR
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Cetak Tiket
                                </Button>
                                <Button
                                    className="w-full col-span-2 bg-rose-600 hover:bg-rose-700 text-white"
                                    onClick={() => router.visit(`/invoice/${showQr.id}`)}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Lihat Invoice / Bukti Bayar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
