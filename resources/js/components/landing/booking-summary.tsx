import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Minus, Plus, ChevronRight, ShieldCheck, Ticket as TicketIcon } from 'lucide-react';

interface Tiket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
}

interface BookingSummaryProps {
    selectedTiket: Tiket | null;
    jumlah: number;
    setJumlah: (jumlah: number) => void;
    loading: boolean;
    handleBooking: () => void;
    formatCurrency: (value: number) => string;
}

export default function BookingSummary({
    selectedTiket,
    jumlah,
    setJumlah,
    loading,
    handleBooking,
    formatCurrency
}: BookingSummaryProps) {
    return (
        <Card className="rounded-[40px] md:rounded-[48px] border-none shadow-2xl shadow-rose-900/10 overflow-hidden lg:sticky lg:top-24">
            <CardHeader className="bg-rose-600 text-white p-8 md:p-10">
                <CardTitle className="text-2xl md:text-3xl font-black flex items-center gap-4 uppercase italic tracking-tighter">
                    <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
                    Detail Pesanan
                </CardTitle>
                <CardDescription className="text-rose-100 text-sm md:text-lg opacity-80 mt-2 font-medium">Selesaikan pembayaran untuk akses masuk.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-10 space-y-8 md:space-y-10 bg-white">
                {selectedTiket ? (
                    <>
                        <div className="space-y-6">
                            <div className="flex flex-col bg-slate-50 p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-inner gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Item Dipilih</p>
                                    <p className="text-xl md:text-2xl font-black text-slate-900 leading-tight uppercase italic">{selectedTiket.nama_tiket}</p>
                                </div>
                                <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-xl w-full">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                        onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                                        disabled={jumlah <= 1}
                                    >
                                        <Minus className="w-5 h-5 stroke-[4]" />
                                    </Button>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Jumlah</span>
                                        <span className="text-3xl font-black text-slate-900 leading-none">{jumlah}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                        onClick={() => setJumlah(Math.min(selectedTiket.kuota, jumlah + 1))}
                                        disabled={jumlah >= selectedTiket.kuota}
                                    >
                                        <Plus className="w-5 h-5 stroke-[4]" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between text-base md:text-lg font-bold text-slate-500 uppercase tracking-tighter">
                                    <span>{selectedTiket.nama_tiket} (x{jumlah})</span>
                                    <span>{formatCurrency(selectedTiket.harga * jumlah)}</span>
                                </div>
                                <div className="flex justify-between text-base md:text-lg font-bold text-slate-500 uppercase tracking-tighter border-b-2 border-slate-50 pb-4">
                                    <span>Layanan Gateway</span>
                                    <span className="text-emerald-600 font-extrabold italic">FEE FREE</span>
                                </div>
                                <div className="pt-4 flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Bayar</span>
                                    <span className="text-4xl md:text-5xl font-black text-rose-600 tracking-tighter">{formatCurrency(selectedTiket.harga * jumlah)}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-16 md:h-20 rounded-[24px] md:rounded-[28px] bg-rose-600 hover:bg-rose-700 text-xl md:text-2xl font-black text-white shadow-2xl shadow-rose-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] group uppercase tracking-widest italic"
                            disabled={!selectedTiket || loading}
                            onClick={handleBooking}
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    Proses...
                                </div>
                            ) : (
                                <>
                                    Bayar Sekarang
                                    <ChevronRight className="ml-2 w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <div className="py-16 md:py-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-slate-50 p-8 md:p-10 rounded-[32px] md:rounded-[40px] text-slate-200 border-4 border-dashed border-slate-100">
                            <TicketIcon className="w-16 h-16 md:w-24 md:h-24" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic">Pilih Tiket</h3>
                            <p className="text-slate-400 max-w-[240px] md:max-w-[280px] mx-auto text-base md:text-lg mt-2 font-medium">Klik pada jenis tiket untuk melanjutkan.</p>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="bg-slate-50 p-6 md:p-8 flex items-center justify-center gap-4 text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                Secured Midtrans Payment Engine
            </CardFooter>
        </Card>
    );
}
