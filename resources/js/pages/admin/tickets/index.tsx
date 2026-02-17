import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Ticket as TicketIcon,
    Calendar,
    Users,
    DollarSign,
} from 'lucide-react';
import { useState } from 'react';

interface Ticket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
    tanggal_berlaku: string;
    created_at: string;
}

interface Props {
    tickets: {
        data: Ticket[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function AdminTicketsIndex({ tickets, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleFilter = () => {
        router.get('/admin/tickets', { search, status }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/tickets/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const isExpired = (date: string) => {
        return new Date(date) < new Date();
    };

    return (
        <AppLayout>
            <Head title="Manajemen Tiket" />

            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Manajemen Tiket</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Kelola master data tiket wisata</p>
                    </div>
                    <Button
                        className="h-14 bg-rose-600 text-white rounded-2xl px-10 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-rose-200"
                        onClick={() => router.visit('/admin/tickets/create')}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Tiket
                    </Button>
                </div>

                <Card className="">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    placeholder="Cari nama tiket..."
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
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="expired">Kadaluarsa</SelectItem>
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
                                        <th className="px-10 py-6">Nama Tiket</th>
                                        <th className="px-10 py-6">Harga</th>
                                        <th className="px-10 py-6">Kuota</th>
                                        <th className="px-10 py-6">Tanggal Berlaku</th>
                                        <th className="px-10 py-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-mono font-black text-slate-300">#{ticket.id}</span>
                                                    <Badge
                                                        className={`font-black uppercase tracking-widest px-3 py-1 rounded-full text-[8px] w-fit shadow-sm ${isExpired(ticket.tanggal_berlaku)
                                                                ? 'bg-rose-100 text-rose-600 border-none'
                                                                : 'bg-emerald-100 text-emerald-600 border-none'
                                                            }`}
                                                    >
                                                        {isExpired(ticket.tanggal_berlaku) ? 'EXPIRED' : 'AKTIF'}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-rose-100 p-3 rounded-xl">
                                                        <TicketIcon className="w-5 h-5 text-rose-600" />
                                                    </div>
                                                    <div className="font-black text-slate-900 uppercase italic leading-tight text-lg group-hover:text-rose-600 transition-colors">
                                                        {ticket.nama_tiket}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                                    <div className="text-lg font-black text-slate-900 tracking-tighter">
                                                        {formatCurrency(ticket.harga)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    <div className="font-black text-slate-700 text-sm">
                                                        {ticket.kuota} Tiket
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <div className="text-sm text-slate-600 font-bold">
                                                        {new Date(ticket.tanggal_berlaku).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl h-10 w-10 p-0 shadow-sm border border-slate-100"
                                                        onClick={() => router.visit(`/admin/tickets/${ticket.id}/edit`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-10 w-10 p-0 shadow-sm border border-slate-100"
                                                        onClick={() => setDeleteId(ticket.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

                {/* Pagination */}
                {tickets.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {tickets.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                className={`h-10 min-w-10 rounded-xl font-black text-xs ${link.active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'
                                    }`}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black uppercase italic text-slate-900">
                            Hapus Tiket?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 font-bold">
                            Apakah Anda yakin ingin menghapus tiket ini? Tindakan ini tidak dapat dibatalkan.
                            Tiket yang sudah digunakan dalam pemesanan tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-black uppercase text-xs">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black uppercase text-xs"
                            onClick={handleDelete}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
