<?php

declare(strict_types=1);

namespace App\Services\MonthlyMenu;

use App\DTOs\MonthlyMenu\MenuTemplateDTO;
use App\Models\MenuTemplate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MenuTemplateServiceInterface
{
    public function getPaginatedTemplates(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getAllTemplates(?int $kitchenId = 1): Collection;
    public function getTemplateById(int $id): ?MenuTemplate;
    public function getTemplateByUuid(string $uuid): ?MenuTemplate;
    public function createTemplate(MenuTemplateDTO $dto): MenuTemplate;
    public function updateTemplate(int $id, MenuTemplateDTO $dto): ?MenuTemplate;
    public function deleteTemplate(int $id): bool;
    public function restoreTemplate(int $id): bool;
    public function duplicateTemplate(int $id): ?MenuTemplate;
    public function setDefault(int $id): ?MenuTemplate;
}
