<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Support\BaseRequest;

class BroadcastMessageRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'channel' => ['required', 'string', 'in:push,email,sms,in_app,whatsapp'],
            'priority' => ['nullable', 'string', 'in:low,normal,high,critical'],
            'recipient_type' => ['required', 'string', 'in:customer,admin'],
            'recipient_ids' => ['required', 'array', 'min:1'],
            'recipient_ids.*' => ['integer'],
            'language' => ['nullable', 'string', 'size:2'],
            'event_name' => ['nullable', 'string', 'max:100'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'Title',
            'message' => 'Message',
            'channel' => 'Channel',
            'priority' => 'Priority',
            'recipient_type' => 'Recipient Type',
            'recipient_ids' => 'Recipient IDs',
            'language' => 'Language',
            'event_name' => 'Event Name',
            'scheduled_at' => 'Scheduled At',
        ];
    }
}
