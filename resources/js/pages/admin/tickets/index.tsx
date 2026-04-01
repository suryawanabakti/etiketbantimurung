import { type BreadcrumbItem } from '@/types';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Tiket',
        href: '/admin/tickets',
    },
];

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Tiket" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Tiket</h1>
                        <p className="text-sm text-muted-foreground">Kelola master data tiket wisata</p>
                    </div>
                    <Button
                        onClick={() => router.visit('/admin/tickets/create')}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Tiket
                    </Button>
                </div>

                <Card>
                    <CardHeader className="bg-muted/30 border-b p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama tiket..."
                                    className="pl-9 bg-background"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Select value={status} onValueChange={(val) => setStatus(val)}>
                                    <SelectTrigger className="w-full md:w-[180px] bg-background">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="expired">Kadaluarsa</SelectItem>
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
                                        <th className="px-4 py-3 font-medium">Nama Tiket</th>
                                        <th className="px-4 py-3 font-medium">Harga</th>
                                        <th className="px-4 py-3 font-medium">Kuota</th>
                                        <th className="px-4 py-3 font-medium">Tanggal Berlaku</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1.5 align-start">
                                                    <span className="text-xs font-mono text-muted-foreground">#{ticket.id}</span>
                                                    <Badge
                                                        variant={isExpired(ticket.tanggal_berlaku) ? "destructive" : "default"}
                                                        className="w-fit text-[10px]"
                                                    >
                                                        {isExpired(ticket.tanggal_berlaku) ? 'EXPIRED' : 'AKTIF'}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-md hidden sm:block">
                                                        <TicketIcon className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div className="font-semibold text-foreground">
                                                        {ticket.nama_tiket}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-foreground">
                                                    {formatCurrency(ticket.harga)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-muted-foreground">
                                                    {ticket.kuota} Tiket
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-muted-foreground">
                                                    {new Date(ticket.tanggal_berlaku).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        onClick={() => router.visit(`/admin/tickets/${ticket.id}/edit`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
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

                    <div className="flex justify-between items-center px-4 py-4 md:px-6 bg-muted/10 border-t">
                        <span className="text-sm text-muted-foreground mr-4">Total: {tickets.data.length} data</span>
                        {tickets.links.length > 3 && (
                            <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                                {tickets.links.map((link, index) => (
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
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Tiket?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus tiket ini? Tindakan ini tidak dapat dibatalkan.
                            Tiket yang sudah digunakan dalam pemesanan tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
