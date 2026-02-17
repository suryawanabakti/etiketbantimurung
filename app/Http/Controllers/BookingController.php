<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\Pembayaran;
use App\Models\Tiket;
use App\Models\TiketQr;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Services\WhatsAppService;

class BookingController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    public function index()
    {
        return Inertia::render('booking', [
            'tikets' => Tiket::where('tanggal_berlaku', '>=', now()->toDateString())
                ->orWhereNull('tanggal_berlaku')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tiket_id' => 'required|exists:tikets,id',
            'jumlah_tiket' => 'required|integer|min:1',
        ]);

        $tiket = Tiket::findOrFail($request->tiket_id);
        $totalHarga = $tiket->harga * $request->jumlah_tiket;

        if ($tiket->kuota < $request->jumlah_tiket) {
            return back()->with('error', 'Kuota tiket tidak mencukupi.');
        }

        return DB::transaction(function () use ($request, $tiket, $totalHarga) {
            $user = Auth::user();

            $pemesanan = Pemesanan::create([
                'user_id' => $user->id,
                'tiket_id' => $request->tiket_id,
                'tanggal_pesan' => now(),
                'jumlah_tiket' => $request->jumlah_tiket,
                'status_pemesanan' => 'pending'
            ]);

            $pembayaran = Pembayaran::create([
                'pemesanan_id' => $pemesanan->id,
                'metode_pembayaran' => 'midtrans',
                'status_pembayaran' => 'pending',
                'tanggal_pembayaran' => null
            ]);

            $params = [
                'transaction_details' => [
                    'order_id' => 'BTM-' . $pemesanan->id . '-' . time(),
                    'gross_amount' => $totalHarga,
                ],
                'customer_details' => [
                    'first_name' => $user->nama,
                    'email' => $user->email,
                    'phone' => $user->no_hp,
                ],
                'item_details' => [
                    [
                        'id' => $tiket->id,
                        'price' => $tiket->harga,
                        'quantity' => $request->jumlah_tiket,
                        'name' => $tiket->nama_tiket,
                    ]
                ],
            ];

            try {
                $snapToken = Snap::getSnapToken($params);
                return redirect()->back()->with('snapToken', $snapToken);
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
            }
        });
    }

    public function success($id)
    {
        $pemesanan = Pemesanan::with(['tiket', 'pembayaran'])->findOrFail($id);

        // Only allow paid if it's still pending
        if ($pemesanan->status_pemesanan === 'pending') {
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
                    $tiketQr = TiketQr::create([
                        'pemesanan_id' => $pemesanan->id,
                        'kode_qr' => 'BTM-' . strtoupper(Str::random(10)),
                        'status_tiket' => 'aktif',
                        'waktu_scan' => null,
                        'petugas_id' => null
                    ]);

                    // Kirim Pesan WhatsApp
                    $this->sendWhatsAppNotification($pemesanan, $tiketQr);
                }
            });
        }


        return redirect()->route('invoice.show', $pemesanan->id);
    }

    public function repay($id)
    {
        $pemesanan = Pemesanan::where('user_id', Auth::id())
            ->where('status_pemesanan', 'pending')
            ->with('tiket')
            ->findOrFail($id);

        $user = Auth::user();
        $tiket = $pemesanan->tiket;
        $totalHarga = $tiket->harga * $pemesanan->jumlah_tiket;

        $params = [
            'transaction_details' => [
                'order_id' => 'BTM-' . $pemesanan->id . '-' . time(), // Unique ID per attempt
                'gross_amount' => $totalHarga,
            ],
            'customer_details' => [
                'first_name' => $user->nama,
                'email' => $user->email,
                'phone' => $user->no_hp,
            ],
            'item_details' => [
                [
                    'id' => $tiket->id,
                    'price' => $tiket->harga,
                    'quantity' => $pemesanan->jumlah_tiket,
                    'name' => $tiket->nama_tiket,
                ]
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return redirect()->back()->with('snapToken', $snapToken);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memproses pembayaran ulang: ' . $e->getMessage());
        }
    }

    private function sendWhatsAppNotification($pemesanan, $tiketQr)
    {
        $wa = new WhatsAppService();
        $user = $pemesanan->user;

        if (!$user || !$user->no_hp) {
            return;
        }

        $message = "Halo *{$user->nama}*,\n\n"
            . "Pembayaran untuk pesanan *#{$pemesanan->id}* telah berhasil! ✅\n\n"
            . "Detail Pesanan:\n"
            . "- Tiket: *{$pemesanan->tiket->nama_tiket}*\n"
            . "- Jumlah: *{$pemesanan->jumlah_tiket} Tiket*\n"
            . "- Kode Tiket: *{$tiketQr->kode_qr}*\n\n"
            . "Silahkan gunakan kode QR di atas atau cek invoice Anda di link berikut:\n"
            . route('invoice.show', $pemesanan->id) . "\n\n"
            . "Terima kasih telah berkunjung ke Bantimurung! 🌿";

        $wa->sendWhatsApp($user->no_hp, $message);
    }
}
