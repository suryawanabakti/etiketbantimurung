<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'isi_notifikasi',
        'status_kirim',
        'waktu_kirim'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
