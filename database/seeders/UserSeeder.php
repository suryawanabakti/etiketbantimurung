<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'nama' => 'Admin Bantimurung',
            'email' => 'admin@bantimurung.id',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Petugas
        User::create([
            'nama' => 'Petugas Loket',
            'email' => 'petugas@bantimurung.id',
            'username' => 'petugas',
            'password' => Hash::make('password'),
            'role' => 'petugas',
        ]);

        // Pengunjung
        User::create([
            'nama' => 'Surya Wana Bakti',
            'email' => 'surya@gmail.com',
            'username' => 'surya',
            'password' => Hash::make('password'),
            'role' => 'pengunjung',
            'no_hp' => '081234567890',
            'tanggal_daftar' => now()->toDateString(),
        ]);
    }
}
