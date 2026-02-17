<?php

namespace Database\Seeders;

use App\Models\Pemesanan;
use App\Models\User;
use App\Models\Tiket;
use Illuminate\Database\Seeder;

class PemesananSeeder extends Seeder
{
    public function run(): void
    {
        $pengunjung = User::where('role', 'pengunjung')->first();
        $tiket = Tiket::first();

        Pemesanan::create([
            'user_id' => $pengunjung->id,
            'tiket_id' => $tiket->id,
            'tanggal_pesan' => now(),
            'jumlah_tiket' => 1,
            'status_pemesanan' => 'paid',
        ]);
    }
}
