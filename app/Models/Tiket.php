<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tiket extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_tiket',
        'harga',
        'kuota',
        'tanggal_berlaku'
    ];

    public function pemesanans()
    {
        return $this->hasMany(Pemesanan::class);
    }
}
