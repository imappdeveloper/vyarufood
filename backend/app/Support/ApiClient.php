<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class ApiClient
{
    protected PendingRequest $client;

    public function __construct(string $baseUrl = '', array $headers = [])
    {
        $this->client = Http::withHeaders(array_merge([
            'Accept' => 'application/json',
        ], $headers));

        if ($baseUrl) {
            $this->client->baseUrl($baseUrl);
        }
    }

    public static function make(string $baseUrl = '', array $headers = []): self
    {
        return new self($baseUrl, $headers);
    }

    public function get(string $endpoint, array $query = []): \Illuminate\Http\Client\Response
    {
        return $this->client->get($endpoint, $query);
    }

    public function post(string $endpoint, array $data = []): \Illuminate\Http\Client\Response
    {
        return $this->client->post($endpoint, $data);
    }

    public function put(string $endpoint, array $data = []): \Illuminate\Http\Client\Response
    {
        return $this->client->put($endpoint, $data);
    }

    public function delete(string $endpoint): \Illuminate\Http\Client\Response
    {
        return $this->client->delete($endpoint);
    }
}
