import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { QrCode, ClipboardList, Scan, Search, Calendar } from 'lucide-react';

interface Stats {
    tiket_discan_hari_ini: number;
    total_scan: number;
    riwayat_scan: any[];
}

interface Props {
    stats: Stats;
    scans: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function PetugasDashboard({ stats, scans, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilter = () => {
        router.get(
            '/dashboard',
            { search },
            { preserveState: true, replace: true }
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Scan Hari Ini</CardTitle>
                        <Calendar className="w-4 h-4 text-indigo-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tiket_discan_hari_ini}</div>
                        <p className="text-xs text-indigo-100 opacity-80">Tiket valid hari ini</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-sky-500 to-sky-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Scan</CardTitle>
                        <QrCode className="w-4 h-4 text-sky-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_scan}</div>
                        <p className="text-xs text-sky-100 opacity-80">Sepanjang masa tugas</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Status Petugas</CardTitle>
                        <Scan className="w-4 h-4 text-purple-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Aktif</div>
                        <p className="text-xs text-purple-100 opacity-80">Siap validasi tiket</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                <CardHeader className="bg-muted/50 border-b border-sidebar-border/70">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold">Riwayat Validasi Tiket</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kode QR atau nama..."
                                className="pl-9 w-full md:w-[300px] bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-sidebar-border/70">
                                <tr>
                                    <th className="px-6 py-4">Kode QR</th>
                                    <th className="px-6 py-4">Pengunjung</th>
                                    <th className="px-6 py-4">Tipe Tiket</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Waktu Scan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70">
                                {scans.data.map((scan) => (
                                    <tr key={scan.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium">{scan.kode_qr}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{scan.pemesanan.user.nama}</div>
                                        </td>
                                        <td className="px-6 py-4">{scan.pemesanan.tiket.nama_tiket}</td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-emerald-500 text-white border-none">
                                                {scan.status_tiket}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(scan.waktu_scan).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                                {scans.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                                            Belum ada riwayat validasi tiket.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {scans.last_page > 1 && (
                        <div className="p-4 border-t border-sidebar-border/70 flex justify-end gap-2">
                            <button
                                onClick={() => router.get(scans.links[0].url)}
                                disabled={!scans.links[0].url}
                                className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => router.get(scans.links[scans.links.length - 1].url)}
                                disabled={!scans.links[scans.links.length - 1].url}
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
