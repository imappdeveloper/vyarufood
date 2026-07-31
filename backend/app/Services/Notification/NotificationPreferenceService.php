<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\NotificationPreference;
use App\Repositories\Notification\NotificationPreferenceRepositoryInterface;
use App\Support\BaseService;

class NotificationPreferenceService extends BaseService implements NotificationPreferenceServiceInterface
{
    protected string $moduleName = 'notification_preference';

    public function __construct(
        protected readonly NotificationPreferenceRepositoryInterface $preferenceRepo,
    ) {}

    public function getPreferences(int $customerId): NotificationPreference
    {
        $preferences = $this->preferenceRepo->findByCustomer($customerId);

        if (! $preferences) {
            $preferences = $this->createDefaultPreferences($customerId);
        }

        return $preferences;
    }

    public function updatePreferences(int $customerId, array $data): NotificationPreference
    {
        return $this->transaction(function () use ($customerId, $data) {
            $preferences = $this->preferenceRepo->findByCustomer($customerId);

            if (! $preferences) {
                $preferences = $this->preferenceRepo->create(array_merge($data, [
                    'customer_id' => $customerId,
                ]));

                $this->logInfo('Preferences created for customer', ['customer_id' => $customerId]);

                return $preferences;
            }

            $updated = $this->preferenceRepo->update($preferences, $data);

            $this->logInfo('Preferences updated for customer', ['customer_id' => $customerId]);
            $this->logActivity('notification_preferences_updated', $updated);

            return $updated;
        });
    }

    public function createDefaultPreferences(int $customerId): NotificationPreference
    {
        return $this->transaction(function () use ($customerId) {
            $data = [
                'customer_id' => $customerId,
                'email_enabled' => true,
                'sms_enabled' => true,
                'push_enabled' => true,
                'whatsapp_enabled' => false,
                'order_updates' => true,
                'subscription_updates' => true,
                'delivery_updates' => true,
                'payment_updates' => true,
                'promotional_enabled' => false,
                'marketing_enabled' => false,
                'newsletter_enabled' => false,
                'quiet_hours_enabled' => false,
                'quiet_hours_start' => '22:00',
                'quiet_hours_end' => '07:00',
            ];

            $preferences = $this->preferenceRepo->create($data);

            $this->logInfo('Default preferences created for customer', ['customer_id' => $customerId]);
            $this->logActivity('notification_preferences_created', $preferences);

            return $preferences;
        });
    }
}
