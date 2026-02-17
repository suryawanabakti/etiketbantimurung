<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\TiketQr;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Pemesanan::with(['user', 'tiket', 'pembayaran', 'tiketQr']);

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status_pemesanan', $request->status);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to'])
        ]);
    }

    public function approve($id)
    {
        $pemesanan = Pemesanan::with(['user', 'pembayaran', 'tiket'])->findOrFail($id);

        if ($pemesanan->status_pemesanan === 'paid') {
            return back()->with('error', 'Transaksi sudah lunas.');
        }

        DB::transaction(function () use ($pemesanan) {
            $pemesanan->update(['status_pemesanan' => 'paid']);
            if ($pemesanan->pembayaran) {
                $pemesanan->pembayaran->update([
                    'status_pembayaran' => 'success',
                    'tanggal_pembayaran' => now()
                ]);
            }

            if (!$pemesanan->tiketQr) {
                // Deplete quota
                $tiket = $pemesanan->tiket;
                if ($tiket) {
                    $tiket->decrement('kuota', $pemesanan->jumlah_tiket);
                }

                // Create TiketQr
                TiketQr::create([
                    'pemesanan_id' => $pemesanan->id,
                    'kode_qr' => 'BTM-' . strtoupper(Str::random(10)),
                    'status_tiket' => 'aktif',
                    'waktu_scan' => null,
                    'petugas_id' => null
                ]);
            }
        });

        return back()->with('success', 'Transaksi #' . $id . ' berhasil disetujui secara manual.');
    }

    public function report(Request $request)
    {
        $today = now()->toDateString();
        $thisMonth = now()->month;
        $thisYear = now()->year;

        $stats = [
            'overview' => [
                'total_transaksi' => Pemesanan::count(),
                'total_lunas' => Pemesanan::where('status_pemesanan', 'paid')->count(),
                'total_pendapatan' => DB::table('pembayarans')
                    ->join('pemesanans', 'pembayarans.pemesanan_id', '=', 'pemesanans.id')
                    ->where('pembayarans.status_pembayaran', 'success')
                    ->sum(DB::raw('pemesanans.jumlah_tiket * (select harga from tikets where id = pemesanans.tiket_id)')),
            ],
            'daily_revenue' => Pemesanan::join('pembayarans', 'pemesanans.id', '=', 'pembayarans.pemesanan_id')
                ->join('tikets', 'pemesanans.tiket_id', '=', 'tikets.id')
                ->where('pembayarans.status_pembayaran', 'success')
                ->whereDate('pemesanans.created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('DATE(pemesanans.created_at) as date'),
                    DB::raw('SUM(pemesanans.jumlah_tiket * tikets.harga) as revenue'),
                    DB::raw('SUM(pemesanans.jumlah_tiket) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'monthly_revenue' => Pemesanan::join('pembayarans', 'pemesanans.id', '=', 'pembayarans.pemesanan_id')
                ->join('tikets', 'pemesanans.tiket_id', '=', 'tikets.id')
                ->where('pembayarans.status_pembayaran', 'success')
                ->whereYear('pemesanans.created_at', $thisYear)
                ->select(
                    DB::raw('MONTHNAME(pemesanans.created_at) as month'),
                    DB::raw('MONTH(pemesanans.created_at) as month_num'),
                    DB::raw('SUM(pemesanans.jumlah_tiket * tikets.harga) as revenue'),
                    DB::raw('SUM(pemesanans.jumlah_tiket) as count')
                )
                ->groupBy('month', 'month_num')
                ->orderBy('month_num')
                ->get(),
            'yearly_revenue' => Pemesanan::join('pembayarans', 'pemesanans.id', '=', 'pembayarans.pemesanan_id')
                ->join('tikets', 'pemesanans.tiket_id', '=', 'tikets.id')
                ->where('pembayarans.status_pembayaran', 'success')
                ->select(
                    DB::raw('YEAR(pemesanans.created_at) as year'),
                    DB::raw('SUM(pemesanans.jumlah_tiket * tikets.harga) as revenue'),
                    DB::raw('SUM(pemesanans.jumlah_tiket) as count')
                )
                ->groupBy('year')
                ->orderBy('year')
                ->get(),
            'ticket_type_breakdown' => Pemesanan::join('tikets', 'pemesanans.tiket_id', '=', 'tikets.id')
                ->where('status_pemesanan', 'paid')
                ->select(
                    'tikets.nama_tiket',
                    DB::raw('SUM(pemesanans.jumlah_tiket) as total_sold'),
                    DB::raw('SUM(pemesanans.jumlah_tiket * tikets.harga) as total_revenue')
                )
                ->groupBy('tikets.nama_tiket')
                ->get()
        ];

        return Inertia::render('reports', [
            'stats' => $stats
        ]);
    }
}
