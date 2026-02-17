<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemesanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tiket_id',
        'tanggal_pesan',
        'jumlah_tiket',
        'status_pemesanan'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tiket()
    {
        return $this->belongsTo(Tiket::class);
    }

    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class);
    }

    public function tiketQr()
    {
        return $this->hasOne(TiketQr::class);
    }
}
