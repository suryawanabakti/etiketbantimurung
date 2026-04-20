<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    protected $apiToken;
    protected $url = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $this->apiToken = config('services.fonnte.token');
    }

    public function sendWhatsApp($to, $message)
    {
        // Normalisasi nomor (08xxx → 628xxx)
        if (str_starts_with($to, '0')) {
            $to = '62' . substr($to, 1);
        }

        // Hapus karakter non-digit dan tanda plus
        $to = preg_replace('/[^0-9]/', '', $to);

        $payload = [
            'target' => $to,
            'message' => $message,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiToken
            ])->post($this->url, $payload);

            if ($response->failed()) {
                Log::error('Fonnte API Error: ' . $response->body());
                return false;
            }

            $result = $response->json();

            if (isset($result['status']) && $result['status'] == true) {
                return true;
            }

            Log::error('Fonnte API Error Response: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error('Fonnte API Exception: ' . $e->getMessage());
            return false;
        }
    }
}
