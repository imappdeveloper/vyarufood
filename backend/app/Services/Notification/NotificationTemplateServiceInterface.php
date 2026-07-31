<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\NotificationTemplate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationTemplateServiceInterface
{
    public function getPaginatedTemplates(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getTemplateById(int $id): ?NotificationTemplate;

    public function getTemplateByCode(string $code): ?NotificationTemplate;

    public function createTemplate(array $data): NotificationTemplate;

    public function updateTemplate(int $id, array $data): ?NotificationTemplate;

    public function deleteTemplate(int $id): bool;

    public function renderTemplate(string $templateCode, array $variables = []): array;
}
