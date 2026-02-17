<?php

namespace Database\Seeders;

use App\Models\Pembayaran;
use App\Models\Pemesanan;
use Illuminate\Database\Seeder;

class PembayaranSeeder extends Seeder
{
    public function run(): void
    {
        $pemesanan = Pemesanan::first();

        Pembayaran::create([
            'pemesanan_id' => $pemesanan->id,
            'metode_pembayaran' => 'QRIS',
            'status_pembayaran' => 'success',
            'tanggal_pembayaran' => now(),
        ]);
    }
}
