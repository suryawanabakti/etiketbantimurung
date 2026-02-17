import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity,
    CreditCard,
    ReceiptText,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    BarChart3,
    PieChart,
    ChevronRight,
    Search
} from 'lucide-react';
import { useState } from 'react';

interface Stats {
    overview: {
        total_transaksi: number;
        total_lunas: number;
        total_pendapatan: number;
    };
    daily_revenue: { date: string; revenue: number; count: number }[];
    monthly_revenue: { month: string; revenue: number; count: number }[];
    yearly_revenue: { year: number; revenue: number; count: number }[];
    ticket_type_breakdown: { nama_tiket: string; total_sold: number; total_revenue: number }[];
}

interface Props {
    stats: Stats;
}

export default function Reports({ stats }: Props) {
    const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const currentData = period === 'daily' ? stats.daily_revenue :
        period === 'monthly' ? stats.monthly_revenue :
            stats.yearly_revenue;

    const maxVal = Math.max(...currentData.map(d => d.revenue), 1);

    return (
        <AppLayout>
            <Head title="Laporan Statistik" />

            <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Intelligence Reports</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Pusat Kendali Data & Analitik Bantimurung</p>
                    </div>
                </div>

                {/* Overviews */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white group hover:scale-[1.02] transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-10">
                            <div className="space-y-1">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Total Transaksi</CardTitle>
                                <div className="text-4xl font-black text-slate-900 italic tracking-tight">{stats.overview.total_transaksi}</div>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-2xl text-white shadow-2xl shadow-slate-200 group-hover:bg-rose-600 transition-colors">
                                <ReceiptText className="w-8 h-8" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 flex items-center justify-between">
                            <Badge className="bg-emerald-50 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                                <TrendingUp className="w-3 h-3 mr-2" />
                                +12% vs last month
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white group hover:scale-[1.02] transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-10">
                            <div className="space-y-1">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Paid Tickets</CardTitle>
                                <div className="text-4xl font-black text-slate-900 italic tracking-tight">{stats.overview.total_lunas}</div>
                            </div>
                            <div className="bg-emerald-500 p-5 rounded-2xl text-white shadow-2xl shadow-emerald-200 group-hover:bg-emerald-600 transition-colors">
                                <Activity className="w-8 h-8" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Efficiency: <span className="text-emerald-500">{((stats.overview.total_lunas / (stats.overview.total_transaksi || 1)) * 100).toFixed(1)}%</span></p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-900/10 rounded-[40px] overflow-hidden bg-slate-900 text-white md:col-span-2 lg:col-span-1 group hover:scale-[1.02] transition-transform">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/30 blur-[100px] rounded-full" />
                            <div className="space-y-1 relative z-10">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none">Total Revenue</CardTitle>
                                <div className="text-4xl font-black italic tracking-tight">{formatCurrency(stats.overview.total_pendapatan)}</div>
                            </div>
                            <div className="bg-rose-600 p-5 rounded-2xl text-white shadow-2xl shadow-rose-900/40 relative z-10">
                                <CreditCard className="w-8 h-8" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 relative z-10">
                            <div className="flex items-center gap-2 group-hover:gap-4 transition-all">
                                <span className="text-xs text-slate-400 font-bold">Manage finances</span>
                                <ChevronRight className="w-4 h-4 text-rose-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Graph */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[48px] overflow-hidden bg-white p-8 md:p-12">
                        <CardHeader className="px-0 pt-0 pb-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none flex items-center gap-3">
                                    Analytics Forecast
                                    <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[9px] px-2 py-0.5">LIVE</Badge>
                                </CardTitle>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Visualisasi pendapatan berdasarkan periode</p>
                            </div>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                {(['daily', 'monthly', 'yearly'] as const).map(p => (
                                    <Button
                                        key={p}
                                        variant="ghost"
                                        className={`h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        onClick={() => setPeriod(p)}
                                    >
                                        {p === 'daily' ? 'Harian' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                    </Button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="px-0 pt-12 h-[450px] flex items-end justify-between gap-3 md:gap-6 relative">
                            {/* Vertical Grid Lines */}
                            <div className="absolute inset-x-0 bottom-[10%] border-t border-slate-50" />
                            <div className="absolute inset-x-0 bottom-[35%] border-t border-slate-50" />
                            <div className="absolute inset-x-0 bottom-[60%] border-t border-slate-50" />
                            <div className="absolute inset-x-0 bottom-[85%] border-t border-slate-50" />

                            {currentData.map((item, i) => {
                                const label = 'date' in item ? item.date.split('-').pop() :
                                    'month' in item ? item.month.slice(0, 3) :
                                        String(item.year);

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-6 group relative z-10">
                                        <div className="w-full relative flex items-end justify-center group-hover:scale-x-110 transition-all duration-500">
                                            <div
                                                className="w-full max-w-[40px] bg-slate-100 rounded-2xl group-hover:bg-rose-500 transition-all duration-500 ease-out shadow-lg shadow-slate-100/50 group-hover:shadow-rose-200"
                                                style={{ height: `${(item.revenue / maxVal) * 300}px` }}
                                            />
                                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl">
                                                {formatCurrency(item.revenue)}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-900 transition-colors">{label}</span>
                                    </div>
                                );
                            })}

                            {currentData.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4 h-full">
                                    <PieChart className="w-12 h-12 opacity-20" />
                                    <span className="font-black uppercase tracking-widest italic text-sm">No data available for this period</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Breakdown */}
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[48px] overflow-hidden bg-white p-8 md:p-12">
                        <CardHeader className="px-0 pt-0 pb-10 flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Ticket Sales</CardTitle>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Performa setiap tipe tiket</p>
                            </div>
                            <BarChart3 className="text-rose-500 w-8 h-8" />
                        </CardHeader>
                        <CardContent className="px-0 space-y-8">
                            {stats.ticket_type_breakdown.map((type, i) => (
                                <div key={i} className="space-y-4 group">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h5 className="font-black text-slate-900 uppercase italic tracking-tight">{type.nama_tiket}</h5>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type.total_sold} Tiket Terjual</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900 tracking-tighter">{formatCurrency(type.total_revenue)}</p>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5">
                                        <div
                                            className="h-full bg-rose-500 rounded-full group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all duration-700"
                                            style={{ width: `${(type.total_revenue / stats.overview.total_pendapatan) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
                                Export Full Dataset <ChevronRight className="w-3 h-3 ml-2" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
