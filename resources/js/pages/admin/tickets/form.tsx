import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Ticket as TicketIcon } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Ticket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
    tanggal_berlaku: string;
}

interface Props {
    ticket: Ticket | null;
}

export default function AdminTicketsForm({ ticket }: Props) {
    const isEdit = !!ticket;

    const { data, setData, post, put, processing, errors } = useForm({
        nama_tiket: ticket?.nama_tiket || '',
        harga: ticket?.harga || 0,
        kuota: ticket?.kuota || 0,
        tanggal_berlaku: ticket?.tanggal_berlaku || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/tickets/${ticket.id}`);
        } else {
            post('/admin/tickets');
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Manajemen Tiket', href: '/admin/tickets' },
            { title: isEdit ? 'Edit Tiket' : 'Tambah Tiket', href: '#' },
        ]}>
            <Head title={isEdit ? 'Edit Tiket' : 'Tambah Tiket'} />

            <div className="flex flex-col gap-6 p-4 md:p-6 h-full flex-1 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.visit('/admin/tickets')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEdit ? 'Edit Tiket' : 'Tambah Tiket Baru'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? 'Perbarui informasi tiket' : 'Buat tiket wisata baru'}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <Card>
                        <CardHeader className="border-b bg-muted/20">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <TicketIcon className="w-5 h-5 text-primary" />
                                    Informasi Tiket
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Tiket */}
                                <div className="space-y-2">
                                    <Label htmlFor="nama_tiket">Nama Tiket <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="nama_tiket"
                                        type="text"
                                        placeholder="Contoh: Tiket Weekday Dewasa"
                                        value={data.nama_tiket}
                                        onChange={(e) => setData('nama_tiket', e.target.value)}
                                        required
                                    />
                                    {errors.nama_tiket && (
                                        <p className="text-destructive text-sm font-medium">{errors.nama_tiket}</p>
                                    )}
                                </div>

                                {/* Harga */}
                                <div className="space-y-2">
                                    <Label htmlFor="harga">Harga (IDR) <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            Rp
                                        </div>
                                        <Input
                                            id="harga"
                                            type="number"
                                            min="0"
                                            step="1000"
                                            placeholder="50000"
                                            className="pl-9"
                                            value={data.harga}
                                            onChange={(e) => setData('harga', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    {errors.harga && (
                                        <p className="text-destructive text-sm font-medium">{errors.harga}</p>
                                    )}
                                </div>

                                {/* Kuota */}
                                <div className="space-y-2">
                                    <Label htmlFor="kuota">Kuota Tiket <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="kuota"
                                        type="number"
                                        min="0"
                                        placeholder="100"
                                        value={data.kuota}
                                        onChange={(e) => setData('kuota', parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    {errors.kuota && (
                                        <p className="text-destructive text-sm font-medium">{errors.kuota}</p>
                                    )}
                                    <p className="text-muted-foreground text-xs">
                                        Jumlah tiket yang tersedia untuk dijual
                                    </p>
                                </div>

                                {/* Tanggal Berlaku */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_berlaku">Tanggal Berlaku <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="tanggal_berlaku"
                                        type="date"
                                        value={data.tanggal_berlaku}
                                        onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_berlaku && (
                                        <p className="text-destructive text-sm font-medium">{errors.tanggal_berlaku}</p>
                                    )}
                                    <p className="text-muted-foreground text-xs">
                                        Tanggal mulai berlaku tiket ini
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => router.visit('/admin/tickets')}
                                        disabled={processing}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={processing}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Menyimpan...' : isEdit ? 'Update Tiket' : 'Simpan Tiket'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2 text-primary">
                                    <TicketIcon className="w-4 h-4" />
                                    Informasi Penting
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-foreground/80 space-y-2 list-disc list-inside">
                                    <li>Pastikan harga tiket sudah sesuai dengan kebijakan yang berlaku</li>
                                    <li>Kuota akan berkurang otomatis setiap ada pemesanan yang dibayar</li>
                                    <li>Tiket yang sudah digunakan dalam pemesanan tidak dapat dihapus</li>
                                    <li>Tanggal berlaku menentukan apakah tiket masih aktif atau sudah expired</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
