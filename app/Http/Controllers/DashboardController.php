<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\Tiket;
use App\Models\TiketQr;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;

        switch ($role) {
            case 'admin':
                return $this->adminDashboard($request);
            case 'petugas':
                return $this->petugasDashboard($request);
            case 'pengunjung':
                return $this->pengunjungDashboard($request);
            default:
                return Inertia::render('dashboard');
        }
    }

    private function adminDashboard(Request $request)
    {
        $stats = [
            'total_tiket_terjual' => Pemesanan::where('status_pemesanan', 'paid')->sum('jumlah_tiket'),
            'total_pendapatan' => DB::table('pembayarans')
                ->join('pemesanans', 'pembayarans.pemesanan_id', '=', 'pemesanans.id')
                ->where('pembayarans.status_pembayaran', 'success')
                ->sum(DB::raw('pemesanans.jumlah_tiket * (select harga from tikets where id = pemesanans.tiket_id)')),
            'total_pengunjung' => User::where('role', 'pengunjung')->count(),
            'transaksi_terakhir' => Pemesanan::with(['user', 'tiket', 'pembayaran'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        // Filter transactions for the table
        $query = Pemesanan::with(['user', 'tiket', 'pembayaran']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            })->orWhereHas('tiket', function ($q) use ($search) {
                $q->where('nama_tiket', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status_pemesanan', $request->status);
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status']),
            'role' => 'admin'
        ]);
    }

    private function petugasDashboard(Request $request)
    {
        $today = now()->toDateString();

        $stats = [
            'tiket_discan_hari_ini' => TiketQr::whereDate('waktu_scan', $today)->count(),
            'total_scan' => TiketQr::where('status_tiket', 'digunakan')->count(),
            'riwayat_scan' => TiketQr::with(['pemesanan.user', 'pemesanan.tiket'])
                ->where('petugas_id', Auth::id())
                ->latest('waktu_scan')
                ->take(10)
                ->get(),
        ];

        // Filter scan history
        $query = TiketQr::with(['pemesanan.user', 'pemesanan.tiket'])
            ->where('petugas_id', Auth::id());

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('pemesanan.user', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            })->orWhere('kode_qr', 'like', "%{$search}%");
        }

        $scans = $query->latest('waktu_scan')->paginate(10)->withQueryString();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'scans' => $scans,
            'filters' => $request->only(['search']),
            'role' => 'petugas'
        ]);
    }

    private function pengunjungDashboard(Request $request)
    {
        $user = Auth::user();

        $stats = [
            'tiket_aktif' => Pemesanan::where('user_id', $user->id)
                ->where('status_pemesanan', 'paid')
                ->whereHas('tiketQr', function ($q) {
                    $q->where('status_tiket', 'aktif');
                })->count(),
            'total_pesanan' => Pemesanan::where('user_id', $user->id)->count(),
        ];

        $query = Pemesanan::with(['tiket', 'pembayaran', 'tiketQr'])
            ->where('user_id', $user->id);

        if ($request->has('status')) {
            $query->where('status_pemesanan', $request->status);
        }

        $myTickets = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'myTickets' => $myTickets,
            'tikets' => Tiket::query()
                ->get(),
            'filters' => $request->only(['status']),
            'role' => 'pengunjung'
        ]);
    }
}
