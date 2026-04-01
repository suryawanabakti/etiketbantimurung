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
        <AppLayout breadcrumbs={[
            { title: 'Laporan Statistik', href: '#' },
        ]}>
            <Head title="Laporan Statistik" />

            <div className="flex flex-col gap-6 p-4 md:p-6 h-full flex-1">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Intelligence Reports</h1>
                        <p className="text-sm text-muted-foreground">Pusat Kendali Data & Analitik Bantimurung</p>
                    </div>
                </div>

                {/* Overviews */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Transaksi
                            </CardTitle>
                            <ReceiptText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.total_transaksi}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">+12%</span>
                                <span className="ml-1">vs last month</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Paid Tickets
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.total_lunas}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Kelancaran Pembayaran: <span className="text-emerald-500 font-medium">{((stats.overview.total_lunas / (stats.overview.total_transaksi || 1)) * 100).toFixed(1)}%</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 lg:col-span-1 border-primary/20 bg-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                            <CreditCard className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.overview.total_pendapatan)}</div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium hover:underline cursor-pointer">
                                <span>Kelola Keuangan</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Graph */}
                <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    Analytics Forecast
                                    <Badge variant="secondary" className="text-[10px]">LIVE</Badge>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">Visualisasi pendapatan berdasarkan periode</p>
                            </div>
                            <div className="flex bg-muted/50 p-1 rounded-lg">
                                {(['daily', 'monthly', 'yearly'] as const).map(p => (
                                    <Button
                                        key={p}
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 px-4 rounded-md text-xs font-medium transition-all ${period === p ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setPeriod(p)}
                                    >
                                        {p === 'daily' ? 'Harian' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                    </Button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] flex items-end justify-between gap-2 md:gap-4 relative pt-6">
                            {/* Vertical Grid Lines */}
                            <div className="absolute inset-x-6 bottom-[10%] border-t border-border/50" />
                            <div className="absolute inset-x-6 bottom-[35%] border-t border-border/50" />
                            <div className="absolute inset-x-6 bottom-[60%] border-t border-border/50" />
                            <div className="absolute inset-x-6 bottom-[85%] border-t border-border/50" />

                            {currentData.map((item, i) => {
                                const label = 'date' in item ? item.date.split('-').pop() :
                                    'month' in item ? item.month.slice(0, 3) :
                                        String(item.year);

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative z-10 h-full justify-end">
                                        <div className="w-full relative flex items-end justify-center transition-all duration-300">
                                            <div
                                                className="w-full max-w-[32px] bg-slate-200 dark:bg-slate-800 rounded-t-md group-hover:bg-slate-900 dark:group-hover:bg-white transition-all duration-300 ease-out"
                                                style={{ height: `${(item.revenue / maxVal) * 250}px` }}
                                            />
                                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all bg-foreground text-background text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                                {formatCurrency(item.revenue)}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase">{label}</span>
                                    </div>
                                );
                            })}

                            {currentData.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <PieChart className="w-8 h-8 opacity-50" />
                                    <span className="text-sm font-medium">Berdum ada data di periode ini</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Breakdown */}
                    <Card>
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle>Ticket Sales</CardTitle>
                                <p className="text-sm text-muted-foreground">Performa setiap tipe tiket</p>
                            </div>
                            <BarChart3 className="text-muted-foreground w-5 h-5" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {stats.ticket_type_breakdown.map((type, i) => (
                                <div key={i} className="space-y-3 group">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h5 className="font-semibold text-sm">{type.nama_tiket}</h5>
                                            <p className="text-xs text-muted-foreground">{type.total_sold} Tiket Terjual</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm tracking-tight">{formatCurrency(type.total_revenue)}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-900 dark:bg-white transition-all duration-700"
                                            style={{ width: `${(type.total_revenue / (stats.overview.total_pendapatan || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 mt-6 border-t">
                                {/* <Button variant="ghost" className="w-full text-xs font-medium text-muted-foreground hover:text-foreground">
                                    Export Full Dataset <ChevronRight className="w-4 h-4 ml-1" />
                                </Button> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
