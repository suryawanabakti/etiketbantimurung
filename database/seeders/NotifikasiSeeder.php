<?php

namespace Database\Seeders;

use App\Models\Notifikasi;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $pengunjung = User::where('role', 'pengunjung')->first();

        Notifikasi::create([
            'user_id' => $pengunjung->id,
            'isi_notifikasi' => 'Pembayaran tiket Bantimurung berhasil. Silakan tunjukkan QR Code saat masuk.',
            'status_kirim' => 'terkirim',
            'waktu_kirim' => now(),
        ]);
    }
}
