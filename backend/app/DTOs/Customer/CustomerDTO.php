<?php

declare(strict_types=1);

namespace App\DTOs\Customer;

final class CustomerDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly string $firstName = '',
        public readonly string $lastName = '',
        public readonly string $email = '',
        public readonly string $phone = '',
        public readonly string $countryCode = '+91',
        public readonly ?string $password = null,
        public readonly ?string $profilePhoto = null,
        public readonly ?string $gender = null,
        public readonly ?string $dateOfBirth = null,
        public readonly ?string $addressLine1 = null,
        public readonly ?string $addressLine2 = null,
        public readonly ?int $countryId = null,
        public readonly ?int $stateId = null,
        public readonly ?int $cityId = null,
        public readonly ?int $areaId = null,
        public readonly ?string $pincode = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?string $status = 'active',
        public readonly bool $isBlocked = false,
        public readonly ?string $blockReason = null,
        public readonly float $walletBalance = 0,
        public readonly string $walletCurrency = 'INR',
        public readonly ?string $referralCode = null,
        public readonly ?int $referredBy = null,
        public readonly bool $emailVerified = false,
        public readonly bool $phoneVerified = false,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
        public readonly ?int $deletedBy = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            firstName: $data['first_name'] ?? '',
            lastName: $data['last_name'] ?? '',
            email: $data['email'] ?? '',
            phone: $data['phone'] ?? '',
            countryCode: $data['country_code'] ?? '+91',
            password: $data['password'] ?? null,
            profilePhoto: $data['profile_photo'] ?? null,
            gender: $data['gender'] ?? null,
            dateOfBirth: $data['date_of_birth'] ?? null,
            addressLine1: $data['address_line_1'] ?? null,
            addressLine2: $data['address_line_2'] ?? null,
            countryId: isset($data['country_id']) ? (int) $data['country_id'] : null,
            stateId: isset($data['state_id']) ? (int) $data['state_id'] : null,
            cityId: isset($data['city_id']) ? (int) $data['city_id'] : null,
            areaId: isset($data['area_id']) ? (int) $data['area_id'] : null,
            pincode: $data['pincode'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            status: $data['status'] ?? 'active',
            isBlocked: (bool) ($data['is_blocked'] ?? false),
            blockReason: $data['block_reason'] ?? null,
            walletBalance: isset($data['wallet_balance']) ? (float) $data['wallet_balance'] : 0,
            walletCurrency: $data['wallet_currency'] ?? 'INR',
            referralCode: $data['referral_code'] ?? null,
            referredBy: isset($data['referred_by']) ? (int) $data['referred_by'] : null,
            emailVerified: (bool) ($data['email_verified'] ?? false),
            phoneVerified: (bool) ($data['phone_verified'] ?? false),
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            deletedBy: isset($data['deleted_by']) ? (int) $data['deleted_by'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'country_code' => $this->countryCode,
            'password' => $this->password,
            'profile_photo' => $this->profilePhoto,
            'gender' => $this->gender,
            'date_of_birth' => $this->dateOfBirth,
            'address_line_1' => $this->addressLine1,
            'address_line_2' => $this->addressLine2,
            'country_id' => $this->countryId,
            'state_id' => $this->stateId,
            'city_id' => $this->cityId,
            'area_id' => $this->areaId,
            'pincode' => $this->pincode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'is_blocked' => $this->isBlocked,
            'block_reason' => $this->blockReason,
            'wallet_balance' => $this->walletBalance,
            'wallet_currency' => $this->walletCurrency,
            'referral_code' => $this->referralCode,
            'referred_by' => $this->referredBy,
            'email_verified' => $this->emailVerified,
            'phone_verified' => $this->phoneVerified,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
