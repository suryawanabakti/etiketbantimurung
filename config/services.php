<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'twilio' => [
        'sid' => env('TWILIO_SID', 'ACd78ebeab921e965e7aa65f89e348790f'),
        'token' => env('TWILIO_AUTH_TOKEN', '00e5479e341a4fdd33da477b4ad04fa7'),
        'whatsapp_from' => env('TWILIO_WHATSAPP_FROM', '+14155238886'),
    ],

    'mocean' => [
        'api_key' => env('MOCEAN_API_KEY'),
        'api_secret' => env('MOCEAN_API_SECRET'),
        'api_token' => env('MOCEAN_API_TOKEN', 'apit-2UPySYeoJeLbzrNOCqDtqPrEVZkHBxOt-ftSXf'),
        'from' => env('MOCEAN_FROM', '601119374535'),
    ],

    'midtrans' => [
        'merchant_id' => env('MIDTRANS_MERCHANT_ID', 'G066882704'),
        'client_key' => env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-sZi_IL9FMDmupLpS'),
        'server_key' => env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-T9rgXVcQhXrfk5mz379pnRTg'),
        'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
        'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
        'is_3ds' => env('MIDTRANS_IS_3DS', true),
    ],

];
