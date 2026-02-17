<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiketQr extends Model
{
    use HasFactory;

    protected $fillable = [
        'pemesanan_id',
        'kode_qr',
        'status_tiket',
        'waktu_scan',
        'petugas_id'
    ];

    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class);
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }
}
