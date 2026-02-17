import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Ticket, Minus, Plus, CreditCard, ChevronRight } from 'lucide-react';

interface Tiket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
    tanggal_berlaku: string | null;
}

interface Props {
    tikets: Tiket[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Booking Tiket',
        href: '/booking',
    },
];

export default function Booking({ tikets }: Props) {
    const [selectedTiket, setSelectedTiket] = useState<Tiket | null>(null);
    const [jumlah, setJumlah] = useState(1);
    const [loading, setLoading] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const { flash } = usePage<any>().props;

    useEffect(() => {
        if (flash.error) {
            alert(flash.error);
        }
    }, [flash.error]);

    useEffect(() => {
        if (flash.snapToken) {
            // @ts-ignore
            window.snap.pay(flash.snapToken, {
                onSuccess: function (result: any) {
                    router.visit('/dashboard');
                },
                onPending: function (result: any) {
                    router.visit('/dashboard');
                },
                onError: function (result: any) {
                    alert('Pembayaran gagal, silakan coba lagi.');
                },
                onClose: function () {
                    setLoading(false);
                },
            });
        }
    }, [flash.snapToken]);

    const handleBooking = () => {
        if (!selectedTiket) return;

        setLoading(true);
        router.post('/booking', {
            tiket_id: selectedTiket.id,
            jumlah_tiket: jumlah,
        }, {
            onFinish: () => setLoading(false),
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Tiket" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Pesan Tiket Wisata</h1>
                    <p className="text-muted-foreground">Pilih tiket dan jumlah yang ingin Anda pesan.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {tikets.map((tiket) => (
                                <Card
                                    key={tiket.id}
                                    className={`cursor-pointer transition-all border-2 ${selectedTiket?.id === tiket.id ? 'border-primary bg-primary/5' : 'border-transparent hover:border-muted-foreground/20'}`}
                                    onClick={() => setSelectedTiket(tiket)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <Ticket className="w-5 h-5" />
                                            </div>
                                            {tiket.kuota < 10 && (
                                                <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                                                    Sisa {tiket.kuota}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="mt-4">{tiket.nama_tiket}</CardTitle>
                                        <CardDescription>Bantimurung Waterpark & Nature</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-primary">
                                            {formatCurrency(tiket.harga)}
                                            <span className="text-sm font-normal text-muted-foreground ml-1">/tiket</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0 text-xs text-muted-foreground">
                                        Berlaku s/d: {tiket.tanggal_berlaku || 'Selamanya'}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {selectedTiket ? (
                                    <>
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">Jumlah Tiket</div>
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                                                    disabled={jumlah <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="text-lg font-bold w-8 text-center">{jumlah}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setJumlah(Math.min(selectedTiket.kuota, jumlah + 1))}
                                                    disabled={jumlah >= selectedTiket.kuota}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t">
                                            <div className="flex justify-between text-sm">
                                                <span>{selectedTiket.nama_tiket} (x{jumlah})</span>
                                                <span>{formatCurrency(selectedTiket.harga * jumlah)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Biaya Layanan</span>
                                                <span className="text-emerald-600 font-medium">Gratis</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold pt-2">
                                                <span>Total Bayar</span>
                                                <span>{formatCurrency(selectedTiket.harga * jumlah)}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Ticket className="w-12 h-12 mx-auto opacity-20 mb-4" />
                                        <p>Pilih tiket terlebih dahulu untuk melanjutkan.</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full text-lg h-12"
                                    disabled={!selectedTiket || loading}
                                    onClick={handleBooking}
                                >
                                    {loading ? 'Memproses...' : 'Bayar Sekarang'}
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </CardFooter>
                        </Card>

                        <div className="p-4 bg-muted/50 rounded-lg text-xs space-y-2">
                            <div className="flex items-center gap-2 font-semibold">
                                <CreditCard className="w-3 h-3" />
                                Pembayaran Aman via Midtrans
                            </div>
                            <p className="text-muted-foreground">
                                Tiket akan otomatis dikirim ke WhatsApp dan dashboard Anda setelah pembayaran berhasil dikonfirmasi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
