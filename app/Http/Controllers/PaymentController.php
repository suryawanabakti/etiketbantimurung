<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\Pembayaran;
use App\Models\TiketQr;
use App\Models\Tiket;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    protected $twilio;

    public function __construct(TwilioService $twilio)
    {
        $this->twilio = $twilio;
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
    }

    public function notification(Request $request)
    {
        try {
            $notif = new Notification();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid notification'], 400);
        }

        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $order_id = $notif->order_id;
        $fraud = $notif->fraud_status;

        // BTM-ID-TIMESTAMP
        $parts = explode('-', $order_id);
        $pemesananId = $parts[1] ?? null;

        if (!$pemesananId) {
            return response()->json(['message' => 'Invalid Order ID'], 400);
        }

        $pemesanan = Pemesanan::with(['user', 'pembayaran', 'tiket'])->find($pemesananId);

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan not found'], 404);
        }

        return DB::transaction(function () use ($pemesanan, $transaction, $fraud, $type) {
            if ($transaction == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $this->updateStatus($pemesanan, 'pending', 'pending');
                    } else {
                        $this->updateStatus($pemesanan, 'lunas', 'berhasil', true);
                    }
                }
            } else if ($transaction == 'settlement') {
                $this->updateStatus($pemesanan, 'lunas', 'berhasil', true);
            } else if ($transaction == 'pending') {
                $this->updateStatus($pemesanan, 'pending', 'pending');
            } else if ($transaction == 'deny') {
                $this->updateStatus($pemesanan, 'batal', 'gagal');
            } else if ($transaction == 'expire') {
                $this->updateStatus($pemesanan, 'batal', 'kadaluarsa');
            } else if ($transaction == 'cancel') {
                $this->updateStatus($pemesanan, 'batal', 'dibatalkan');
            }

            return response()->json(['message' => 'OK']);
        });
    }

    private function updateStatus($pemesanan, $pemesananStatus, $pembayaranStatus, $generateTicket = false)
    {
        $pemesanan->update(['status_pemesanan' => $pemesananStatus]);
        $pemesanan->pembayaran->update([
            'status_pembayaran' => $pembayaranStatus,
            'tanggal_pembayaran' => $pembayaranStatus == 'berhasil' ? now() : $pemesanan->pembayaran->tanggal_pembayaran
        ]);

        if ($generateTicket && !$pemesanan->tiketQr) {
            // Deplete quota
            $tiket = Tiket::find($pemesanan->tiket_id);
            if ($tiket) {
                $tiket->decrement('kuota', $pemesanan->jumlah_tiket);
            }

            // Create TiketQr
            $kodeQr = 'BTM-' . strtoupper(Str::random(10));
            TiketQr::create([
                'pemesanan_id' => $pemesanan->id,
                'kode_qr' => $kodeQr,
                'status_tiket' => 'aktif',
                'waktu_scan' => null,
                'petugas_id' => null
            ]);

            // Send WA Notification
            $user = $pemesanan->user;
            if ($user->no_hp) {
                $message = "Halo {$user->nama},\n\nPembayaran tiket Bantimurung Anda berhasil! \n\nDetail Pesanan:\nNo. Pesanan: #{$pemesanan->id}\nTiket: {$pemesanan->tiket->nama_tiket}\nJumlah: {$pemesanan->jumlah_tiket}\nKode Tiket: {$kodeQr}\n\nSilakan tunjukkan QR Code di dashboard aplikasi saat tiba di lokasi. Selamat berwisata!";
                $this->twilio->sendWhatsApp($user->no_hp, $message);
            }
        }
    }
}
