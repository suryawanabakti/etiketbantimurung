<?php

use App\Services\TwilioService;
use Illuminate\Support\Facades\Route;

Route::get('test-twilio', function (TwilioService $twilio) {
    $to = request('to');
    $message = request('message', 'Halo! Ini adalah pesan pengetesan dari sistem e-tiket Bantimurung.');

    if (!$to) {
        return response()->json([
            'success' => false,
            'message' => 'Parameter "to" (nomor WhatsApp) diperlukan. Contoh: /test-twilio?to=08123456789'
        ], 400);
    }

    $result = $twilio->sendWhatsApp($to, $message);

    if ($result) {
        return response()->json([
            'success' => true,
            'message' => "Pesan berhasil dikirim ke $to"
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Gagal mengirim pesan. Pastikan kredensial Twilio sudah benar dan nomor dalam format valid.'
    ], 500);
});
