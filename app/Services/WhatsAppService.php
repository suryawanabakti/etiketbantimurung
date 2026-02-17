<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $apiToken;
    protected $from;
    protected $url = 'https://rest.moceanapi.com/rest/2/send-message/whatsapp';

    public function __construct()
    {
        $this->apiToken = config('services.mocean.api_token');
        $this->from = config('services.mocean.from');
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
            'mocean-from' => $this->from,
            'mocean-to' => $to,
            'mocean-content' => [
                'type' => 'text',
                'text' => $message
            ]
        ];

        try {
            $response = \Illuminate\Support\Facades\Http::withToken($this->apiToken)
                ->post($this->url, $payload);

            if ($response->failed()) {
                Log::error('Mocean API Error: ' . $response->body());
                return false;
            }

            $result = $response->json();

            if (isset($result['status']) && $result['status'] == 0) {
                return true;
            }

            Log::error('Mocean API Error Response: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error('Mocean API Exception: ' . $e->getMessage());
            return false;
        }
    }
}
