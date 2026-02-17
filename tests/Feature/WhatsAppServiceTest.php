<?php

namespace Tests\Feature;

use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config(['services.mocean.api_token' => 'test_token']);
    config(['services.mocean.from' => '601119374535']);
});

it('normalizes Indonesian phone numbers correctly', function () {
    Http::fake([
        '*' => Http::response(['status' => 0], 200)
    ]);

    $service = new WhatsAppService();

    // Normalizes 08xxx to 628xxx
    $service->sendWhatsApp('08123456789', 'Test message');

    Http::assertSent(function ($request) {
        return $request->url() == 'https://rest.moceanapi.com/rest/2/send-message/whatsapp' &&
            $request['mocean-to'] == '628123456789';
    });
});

it('returns true on successful Mocean response', function () {
    Http::fake([
        '*' => Http::response(['status' => 0], 200)
    ]);

    $service = new WhatsAppService();
    $result = $service->sendWhatsApp('628123456789', 'Test message');

    expect($result)->toBeTrue();
});

it('returns false on failed Mocean response', function () {
    Http::fake([
        '*' => Http::response(['status' => 1, 'err_msg' => 'Invalid Request'], 400)
    ]);

    $service = new WhatsAppService();
    $result = $service->sendWhatsApp('628123456789', 'Test message');

    expect($result)->toBeFalse();
});
