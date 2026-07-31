<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Support\BaseRequest;

class UpdateNotificationPreferencesRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'push_enabled' => ['nullable', 'boolean'],
            'email_enabled' => ['nullable', 'boolean'],
            'sms_enabled' => ['nullable', 'boolean'],
            'marketing_enabled' => ['nullable', 'boolean'],
            'order_enabled' => ['nullable', 'boolean'],
            'payment_enabled' => ['nullable', 'boolean'],
            'subscription_enabled' => ['nullable', 'boolean'],
            'system_enabled' => ['nullable', 'boolean'],
            'language' => ['nullable', 'string', 'size:2'],
        ];
    }

    public function attributes(): array
    {
        return [
            'push_enabled' => 'Push Enabled',
            'email_enabled' => 'Email Enabled',
            'sms_enabled' => 'SMS Enabled',
            'marketing_enabled' => 'Marketing Enabled',
            'order_enabled' => 'Order Enabled',
            'payment_enabled' => 'Payment Enabled',
            'subscription_enabled' => 'Subscription Enabled',
            'system_enabled' => 'System Enabled',
            'language' => 'Language',
        ];
    }
}
