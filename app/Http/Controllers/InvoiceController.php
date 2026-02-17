<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    public function show($id)
    {

        $pemesanan = Pemesanan::with(['tiket', 'pembayaran', 'user', 'tiketQr'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($pemesanan->status_pemesanan !== 'paid') {
            return redirect()->route('dashboard')->with('error', 'Invoice belum tersedia untuk pesanan ini.');
        }

        return Inertia::render('invoice', [
            'pemesanan' => $pemesanan
        ]);
    }
}
