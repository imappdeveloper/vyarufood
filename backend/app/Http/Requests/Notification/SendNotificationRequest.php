<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Support\BaseRequest;

class SendNotificationRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'recipient_type' => ['required', 'string', 'in:customer,admin'],
            'recipient_id' => ['required', 'integer'],
            'template_id' => ['nullable', 'integer', 'exists:notification_templates,id'],
            'event_name' => ['nullable', 'string', 'max:100'],
            'channel' => ['required', 'string', 'in:push,email,sms,in_app,whatsapp'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'payload' => ['nullable', 'array'],
            'priority' => ['nullable', 'string', 'in:low,normal,high,critical'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ];
    }

    public function attributes(): array
    {
        return [
            'recipient_type' => 'Recipient Type',
            'recipient_id' => 'Recipient ID',
            'template_id' => 'Template ID',
            'event_name' => 'Event Name',
            'channel' => 'Channel',
            'title' => 'Title',
            'message' => 'Message',
            'payload' => 'Payload',
            'priority' => 'Priority',
            'scheduled_at' => 'Scheduled At',
        ];
    }
}
