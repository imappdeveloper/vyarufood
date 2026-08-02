<?php

declare(strict_types=1);

namespace App\Services\Auth;

use Illuminate\Support\Facades\Http;

class FirebasePhoneVerifier
{
    public function verify(string $idToken, string $phone): bool
    {
        $user = $this->lookup($idToken);

        if (! $user || empty($user['phoneNumber'])) {
            return false;
        }

        $firebasePhone = (string) $user['phoneNumber'];

        return $firebasePhone === $phone || str_ends_with($firebasePhone, $phone);
    }

    /**
     * Look up the Firebase user record for a verified ID token.
     *
     * @return array<string, mixed>|null
     */
    public function lookup(string $idToken): ?array
    {
        $apiKey = config('services.firebase.api_key');

        if (empty($apiKey)) {
            return null;
        }

        $response = Http::timeout(10)->post(
            "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={$apiKey}",
            ['idToken' => $idToken],
        );

        if ($response->failed()) {
            return null;
        }

        return $response->json('users.0');
    }
}
