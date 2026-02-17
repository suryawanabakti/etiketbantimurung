<?php

namespace App\Http\Controllers;

use App\Models\TiketQr;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function index()
    {

        $history = TiketQr::with(['pemesanan.user', 'pemesanan.tiket'])
            ->whereNotNull('waktu_scan')
            ->orderBy('waktu_scan', 'desc')
            ->limit(10)
            ->get();

        return inertia('scan', [
            'history' => $history
        ]);
    }

    public function scan(Request $request)
    {

        $request->validate([
            'kode_qr' => 'required|exists:tiket_qrs,kode_qr'
        ]);
        $tiketQr = TiketQr::with('pemesanan.user')->where('kode_qr', $request->kode_qr)->first();

        if ($tiketQr->status_tiket !== 'aktif') {
            return back()->with('error', 'Tiket sudah tidak aktif atau sudah digunakan.');
        }

        // Update status
        $tiketQr->update([
            'status_tiket' => 'digunakan',
            'waktu_scan' => now('Asia/Makassar'),
            'petugas_id' => Auth::id()
        ]);

        // Send WA Notification to Pengunjung
        $user = $tiketQr->pemesanan->user;
        if ($user->no_hp) {
            $message = "Halo {$user->nama}, Tiket Anda (#{$tiketQr->kode_qr}) telah berhasil diverifikasi oleh petugas pada " . now()->format('H:i:s d-m-Y') . ". Selamat menikmati kunjungan Anda di Bantimurung!";
            $this->whatsappService->sendWhatsApp($user->no_hp, $message);
        }

        return back()->with([
            'success' => 'Tiket berhasil diverifikasi.',
            'last_scanned' => $tiketQr->load(['pemesanan.user', 'pemesanan.tiket'])
        ]);
    }
}
