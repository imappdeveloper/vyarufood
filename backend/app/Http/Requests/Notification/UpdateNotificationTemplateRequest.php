<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateNotificationTemplateRequest extends BaseRequest
{
    public function rules(): array
    {
        $templateId = $this->route('id');

        return [
            'template_code' => ['sometimes', 'string', 'max:100', Rule::unique('notification_templates', 'template_code')->ignore($templateId)],
            'template_name' => ['sometimes', 'string', 'max:255'],
            'notification_type' => ['sometimes', 'string', 'in:transactional,marketing,system,reminder'],
            'channel' => ['sometimes', 'string', 'in:push,email,sms,in_app,whatsapp'],
            'subject' => ['nullable', 'string', 'max:255'],
            'title' => ['sometimes', 'string', 'max:255'],
            'message' => ['sometimes', 'string'],
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
