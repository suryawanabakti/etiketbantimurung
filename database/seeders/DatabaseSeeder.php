<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TiketSeeder::class,
            PemesananSeeder::class,
            PembayaranSeeder::class,
            TiketQrSeeder::class,
            NotifikasiSeeder::class,
        ]);
    }
}
