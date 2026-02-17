import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ReceiptText, BarChart3, Ticket } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const userRole = auth.user.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (userRole === 'admin' || userRole === 'petugas') {
        mainNavItems.push({
            title: 'Scan Tiket',
            href: '/tickets/scan',
            icon: Ticket,
        });
        mainNavItems.push({
            title: 'Admin Tiket',
            href: '/admin/tickets',
            icon: Ticket,
        });
        mainNavItems.push({
            title: 'Transaksi',
            href: '/transactions',
            icon: ReceiptText,
        });

        if (userRole === 'admin') {
            mainNavItems.push({
                title: 'Laporan',
                href: '/reports',
                icon: BarChart3,
            });
        }
    }

    if (userRole === 'pengunjung') {
        mainNavItems.push({
            title: 'Beli Tiket',
            href: '/#tickets',
            icon: Ticket,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
