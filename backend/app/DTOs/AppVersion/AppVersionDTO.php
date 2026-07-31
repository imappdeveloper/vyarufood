<?php

declare(strict_types=1);

namespace App\DTOs\AppVersion;

final class AppVersionDTO
{
    public function __construct(
        public readonly string $platform,
        public readonly string $versionName,
        public readonly int $versionCode,
        public readonly ?string $minimumSupportedVersion = null,
        public readonly bool $forceUpdate = false,
        public readonly ?string $releaseNotes = null,
        public readonly string $status = 'active',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            platform: $data['platform'] ?? '',
            versionName: $data['version_name'] ?? '',
            versionCode: (int) ($data['version_code'] ?? 0),
            minimumSupportedVersion: $data['minimum_supported_version'] ?? null,
            forceUpdate: $data['force_update'] ?? false,
            releaseNotes: $data['release_notes'] ?? null,
            status: $data['status'] ?? 'active',
        );
    }

    public function toArray(): array
    {
        return [
            'platform' => $this->platform,
            'version_name' => $this->versionName,
            'version_code' => $this->versionCode,
            'minimum_supported_version' => $this->minimumSupportedVersion,
            'force_update' => $this->forceUpdate,
            'release_notes' => $this->releaseNotes,
            'status' => $this->status,
        ];
    }
}
