<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Support\BaseRequest;

class StoreNotificationTemplateRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'template_code' => ['required', 'string', 'max:100', 'unique:notification_templates,template_code'],
            'template_name' => ['required', 'string', 'max:255'],
            'notification_type' => ['required', 'string', 'in:transactional,marketing,system,reminder'],
            'channel' => ['required', 'string', 'in:push,email,sms,in_app,whatsapp'],
            'subject' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'variables' => ['nullable', 'array'],
            'variables.*' => ['string'],
            'language' => ['nullable', 'string', 'size:2'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'template_code' => 'Template Code',
            'template_name' => 'Template Name',
            'notification_type' => 'Notification Type',
            'channel' => 'Channel',
            'subject' => 'Subject',
            'title' => 'Title',
            'message' => 'Message',
            'variables' => 'Variables',
            'language' => 'Language',
            'status' => 'Status',
        ];
    }
}
