<?php

namespace Database\Seeders;

use App\Models\TiketQr;
use App\Models\Pemesanan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TiketQrSeeder extends Seeder
{
    public function run(): void
    {
        $pemesanan = Pemesanan::first();

        TiketQr::create([
            'pemesanan_id' => $pemesanan->id,
            'kode_qr' => Str::uuid(), // isi QR
            'status_tiket' => 'aktif',
        ]);
    }
}
