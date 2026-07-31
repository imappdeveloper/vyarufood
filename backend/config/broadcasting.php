<?php

return [

    'default' => env('Broadcast_CONNECTION', 'log'),

    'connections' => [

        'reverb' => [
            'driver' => 'reverb',
            'app_id' => env('REVERB_APP_ID'),
            'app_key' => env('REVERB_APP_KEY'),
            'app_secret' => env('REVERB_APP_SECRET'),
            'host' => env('REVERB_HOST'),
            'port' => env('REVERB_PORT', 443),
            'scheme' => env('REVERB_SCHEME', 'https'),
            'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
        ],

        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'host' => env('PUSHER_HOST', 'api-mt1.pusher.com'),
                'port' => (int) env('PUSHER_PORT', 443),
                'scheme' => env('PUSHER_SCHEME', 'https'),
                'useTLS' => true,
            ],
            'client_options' => [
                'curl' => [
                    CURLOPT_CAINFO => env('PUSHER_CA_CERT_PATH'),
                ],
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'app_id' => env('ABLY_APP_ID'),
            'secret' => env('ABLY_SECRET'),
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

    'options' => [
        'broadcast' => env('BROADCAST_DRIVER', 'log'),
        'prefix' => env('BROADCAST_PREFIX', 'tiffin'),
    ],

];
