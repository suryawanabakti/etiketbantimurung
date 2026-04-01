import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Clock } from 'lucide-react';

interface Tiket {
    id: number;
    nama_tiket: string;
    harga: number;
    kuota: number;
    tanggal_berlaku: string | null;
}

interface TicketListProps {
    tikets: Tiket[];
    selectedTiket: Tiket | null;
    onSelectTiket: (tiket: Tiket) => void;
    formatCurrency: (value: number) => string;
}

export default function TicketList({ tikets, selectedTiket, onSelectTiket, formatCurrency }: TicketListProps) {
    return (
        <div className="grid gap-8 md:grid-cols-2">
            {tikets.map((tiket) => (
                <Card
                    key={tiket.id}
                    className={`group cursor-pointer rounded-[32px] md:rounded-[40px] transition-all duration-500 border-2 overflow-hidden ${selectedTiket?.id === tiket.id
                        ? 'border-red-800 bg-red-50/50 shadow-2xl shadow-red-200 scale-[1.01]'
                        : 'border-slate-100 hover:border-red-200 bg-white hover:shadow-xl hover:shadow-slate-200'
                        }`}
                    onClick={() => onSelectTiket(tiket)}
                >
                    <CardHeader className="p-6 md:p-8 pb-4 relative">
                        <div className="flex justify-between items-start mb-4 md:mb-6">
                            <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl transition-all duration-500 ${selectedTiket?.id === tiket.id
                                ? 'bg-red-800 text-white shadow-xl shadow-red-200'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-800'
                                }`}>
                                <Ticket className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            {tiket.kuota < 10 && (
                                <Badge variant="destructive" className="bg-red-600 font-bold px-3 md:px-4 py-1 rounded-full animate-pulse text-[10px] md:text-xs">
                                    Sisa {tiket.kuota}
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-red-800 transition-colors uppercase italic">{tiket.nama_tiket}</CardTitle>
                        <CardDescription className="text-base md:text-lg font-medium text-slate-400">Taman Wisata Maros</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 pt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Harga Tiket</span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl sm:text-4xl md:text-5xl font-black transition-colors ${selectedTiket?.id === tiket.id ? 'text-red-800' : 'text-slate-900'}`}>
                                    {formatCurrency(tiket.harga)}
                                </span>
                                <span className="text-slate-400 font-bold text-xs sm:text-sm md:text-lg">/orang</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 md:p-8 pt-0 flex items-center text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest">
                        <div className="h-px flex-1 bg-slate-100 mr-4" />
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-2 text-red-700" />
                        {tiket.tanggal_berlaku || 'Check-in Kapan Saja'}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
