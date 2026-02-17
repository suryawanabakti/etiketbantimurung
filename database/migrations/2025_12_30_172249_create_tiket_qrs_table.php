<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tiket_qrs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pemesanan_id')
                ->constrained('pemesanans')
                ->cascadeOnDelete();

            $table->text('kode_qr');
            $table->enum('status_tiket', ['aktif', 'digunakan', 'expired'])
                ->default('aktif');

            $table->dateTime('waktu_scan')->nullable();

            $table->foreignId('petugas_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiket_qrs');
    }
};
