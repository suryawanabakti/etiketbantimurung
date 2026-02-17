<?php

namespace Database\Seeders;

use App\Models\Tiket;
use Illuminate\Database\Seeder;

class TiketSeeder extends Seeder
{
    public function run(): void
    {
        Tiket::create([
            'nama_tiket' => 'Tiket Wisata Bantimurung',
            'harga' => 25000,
            'kuota' => 500,
            'tanggal_berlaku' => now()->addDays(7)->toDateString(),
        ]);
    }
}
