import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import PetugasDashboard from '@/components/dashboard/petugas-dashboard';
import VisitorHome from '@/components/dashboard/visitor-home';
import VisitorLayout from '@/layouts/visitor-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    role: 'admin' | 'petugas' | 'pengunjung';
    stats: any;
    transactions?: any;
    scans?: any;
    myTickets?: any;
    tikets?: any;
    filters: any;
}

export default function Dashboard({ role, stats, transactions, scans, myTickets, tikets, filters }: DashboardProps) {
    const { auth, flash } = usePage().props as any;

    if (role === 'pengunjung') {
        return (
            <VisitorLayout>
                <Head title="Beranda Pengunjung" />
                <VisitorHome stats={stats} myTickets={myTickets} tikets={tikets} flash={flash} />
            </VisitorLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Selamat Datang, {auth.user.nama}!</h1>
                    <p className="text-muted-foreground">
                        {role === 'admin' && 'Kelola sistem e-tiket Bantimurung Anda di sini.'}
                        {role === 'petugas' && 'Validasi tiket pengunjung dengan cepat dan akurat.'}
                    </p>
                </div>

                {role === 'admin' && stats && transactions && (
                    <AdminDashboard stats={stats} transactions={transactions} filters={filters} />
                )}

                {role === 'petugas' && stats && scans && (
                    <PetugasDashboard stats={stats} scans={scans} filters={filters} />
                )}

                {!role && (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl">
                        <p className="text-muted-foreground">Memuat data dashboard...</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
