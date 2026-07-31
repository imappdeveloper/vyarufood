<?php

declare(strict_types=1);

namespace App\DTOs\SystemSetting;

final class SystemSettingDTO
{
    public function __construct(
        public readonly string $settingGroup,
        public readonly string $settingKey,
        public readonly ?string $settingValue = null,
        public readonly string $dataType = 'string',
        public readonly bool $isEncrypted = false,
        public readonly bool $autoload = true,
        public readonly string $status = 'active',
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            settingGroup: $data['setting_group'] ?? '',
            settingKey: $data['setting_key'] ?? '',
            settingValue: $data['setting_value'] ?? null,
            dataType: $data['data_type'] ?? 'string',
            isEncrypted: $data['is_encrypted'] ?? false,
            autoload: $data['autoload'] ?? true,
            status: $data['status'] ?? 'active',
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'setting_group' => $this->settingGroup,
            'setting_key' => $this->settingKey,
            'setting_value' => $this->settingValue,
            'data_type' => $this->dataType,
            'is_encrypted' => $this->isEncrypted,
            'autoload' => $this->autoload,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ];
    }
}
