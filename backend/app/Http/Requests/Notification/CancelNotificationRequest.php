<?php

declare(strict_types=1);

namespace App\Http\Requests\Notification;

use App\Support\BaseRequest;

class CancelNotificationRequest extends BaseRequest
{
    public function rules(): array
    {
        return [];
    }
}
