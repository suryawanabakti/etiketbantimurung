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
        <AppLayout>
            <Head title={isEdit ? 'Edit Tiket' : 'Tambah Tiket'} />

            <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="h-12 w-12 rounded-xl bg-slate-100 hover:bg-slate-200"
                        onClick={() => router.visit('/admin/tickets')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                            {isEdit ? 'Edit Tiket' : 'Tambah Tiket Baru'}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            {isEdit ? 'Perbarui informasi tiket' : 'Buat tiket wisata baru'}
                        </p>
                    </div>
                </div>

                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-rose-600 to-rose-700 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                                <TicketIcon className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                                Informasi Tiket
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Nama Tiket */}
                            <div className="space-y-3">
                                <Label htmlFor="nama_tiket" className="text-slate-900 font-black uppercase tracking-widest text-xs">
                                    Nama Tiket *
                                </Label>
                                <Input
                                    id="nama_tiket"
                                    type="text"
                                    placeholder="Contoh: Tiket Weekday Dewasa"
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-900"
                                    value={data.nama_tiket}
                                    onChange={(e) => setData('nama_tiket', e.target.value)}
                                    required
                                />
                                {errors.nama_tiket && (
                                    <p className="text-rose-600 text-sm font-bold">{errors.nama_tiket}</p>
                                )}
                            </div>

                            {/* Harga */}
                            <div className="space-y-3">
                                <Label htmlFor="harga" className="text-slate-900 font-black uppercase tracking-widest text-xs">
                                    Harga (IDR) *
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">
                                        Rp
                                    </span>
                                    <Input
                                        id="harga"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        placeholder="50000"
                                        className="h-14 pl-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-900"
                                        value={data.harga}
                                        onChange={(e) => setData('harga', parseFloat(e.target.value) || 0)}
                                        required
                                    />
                                </div>
                                {errors.harga && (
                                    <p className="text-rose-600 text-sm font-bold">{errors.harga}</p>
                                )}
                            </div>

                            {/* Kuota */}
                            <div className="space-y-3">
                                <Label htmlFor="kuota" className="text-slate-900 font-black uppercase tracking-widest text-xs">
                                    Kuota Tiket *
                                </Label>
                                <Input
                                    id="kuota"
                                    type="number"
                                    min="0"
                                    placeholder="100"
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-900"
                                    value={data.kuota}
                                    onChange={(e) => setData('kuota', parseInt(e.target.value) || 0)}
                                    required
                                />
                                {errors.kuota && (
                                    <p className="text-rose-600 text-sm font-bold">{errors.kuota}</p>
                                )}
                                <p className="text-slate-400 text-xs font-bold">
                                    Jumlah tiket yang tersedia untuk dijual
                                </p>
                            </div>

                            {/* Tanggal Berlaku */}
                            <div className="space-y-3">
                                <Label htmlFor="tanggal_berlaku" className="text-slate-900 font-black uppercase tracking-widest text-xs">
                                    Tanggal Berlaku *
                                </Label>
                                <Input
                                    id="tanggal_berlaku"
                                    type="date"
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-900"
                                    value={data.tanggal_berlaku}
                                    onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                                    required
                                />
                                {errors.tanggal_berlaku && (
                                    <p className="text-rose-600 text-sm font-bold">{errors.tanggal_berlaku}</p>
                                )}
                                <p className="text-slate-400 text-xs font-bold">
                                    Tanggal mulai berlaku tiket ini
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-slate-200 hover:bg-slate-50"
                                    onClick={() => router.visit('/admin/tickets')}
                                    disabled={processing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 hover:scale-105 transition-all"
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
                <Card className="border-2 border-blue-100 bg-blue-50/50 rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <div className="bg-blue-600 p-3 rounded-xl h-fit">
                                <TicketIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black text-blue-900 uppercase tracking-wide text-sm">
                                    Informasi Penting
                                </h3>
                                <ul className="text-blue-700 text-sm font-bold space-y-1 list-disc list-inside">
                                    <li>Pastikan harga tiket sudah sesuai dengan kebijakan yang berlaku</li>
                                    <li>Kuota akan berkurang otomatis setiap ada pemesanan yang dibayar</li>
                                    <li>Tiket yang sudah digunakan dalam pemesanan tidak dapat dihapus</li>
                                    <li>Tanggal berlaku menentukan apakah tiket masih aktif atau sudah expired</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
