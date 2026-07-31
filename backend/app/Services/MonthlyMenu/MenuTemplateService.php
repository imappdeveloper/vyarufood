<?php

declare(strict_types=1);

namespace App\Services\MonthlyMenu;

use App\DTOs\MonthlyMenu\MenuTemplateDTO;
use App\Models\MenuTemplate;
use App\Models\MenuTemplateItem;
use App\Repositories\MonthlyMenu\MenuTemplateRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MenuTemplateService extends BaseService implements MenuTemplateServiceInterface
{
    protected string $moduleName = 'menu_template';

    public function __construct(
        protected MenuTemplateRepositoryInterface $templateRepo,
    ) {}

    public function getPaginatedTemplates(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->templateRepo->getPaginated($filters, $perPage);
    }

    public function getAllTemplates(?int $kitchenId = 1): Collection
    {
        $cacheKey = CacheManager::cacheKey('menu_template', 'all', (string) ($kitchenId ?? 1));

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($kitchenId) {
            return $this->templateRepo->getAll($kitchenId);
        });
    }

    public function getTemplateById(int $id): ?MenuTemplate
    {
        return $this->templateRepo->getById($id);
    }

    public function getTemplateByUuid(string $uuid): ?MenuTemplate
    {
        return $this->templateRepo->getByUuid($uuid);
    }

    public function createTemplate(MenuTemplateDTO $dto): MenuTemplate
    {
        return $this->transaction(function () use ($dto) {
            $data = $dto->toArray();

            if ($dto->isDefault) {
                $this->templateRepo->getAll($dto->kitchenId)->each(function ($t) {
                    $this->templateRepo->update($t->id, ['is_default' => false]);
                });
            }

            $template = $this->templateRepo->create($data);

            CacheManager::flush('menu_template');

            $this->logInfo('Menu template created', ['template_id' => $template->id, 'name' => $template->template_name]);
            $this->logActivity('menu_template_created', $template);

            return $template;
        });
    }

    public function updateTemplate(int $id, MenuTemplateDTO $dto): ?MenuTemplate
    {
        return $this->transaction(function () use ($id, $dto) {
            $existing = $this->templateRepo->getById($id);

            if (! $existing) {
                return null;
            }

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid'])->toArray();

            if ($dto->isDefault && ! $existing->is_default) {
                $this->templateRepo->getAll($dto->kitchenId)->each(function ($t) use ($id) {
                    if ($t->id !== $id) {
                        $this->templateRepo->update($t->id, ['is_default' => false]);
                    }
                });
            }

            $template = $this->templateRepo->update($id, $data);

            CacheManager::flush('menu_template');

            $this->logInfo('Menu template updated', ['template_id' => $id]);
            $this->logActivity('menu_template_updated', $template);

            return $template;
        });
    }

    public function deleteTemplate(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $existing = $this->templateRepo->getById($id);

            if (! $existing) {
                return false;
            }

            $result = $this->templateRepo->delete($id);

            if ($result) {
                CacheManager::flush('menu_template');
                $this->logInfo('Menu template deleted', ['template_id' => $id]);
                $this->logActivity('menu_template_deleted', $existing);
            }

            return $result;
        });
    }

    public function restoreTemplate(int $id): bool
    {
        $result = $this->templateRepo->restore($id);

        if ($result) {
            CacheManager::flush('menu_template');
            $this->logInfo('Menu template restored', ['template_id' => $id]);
        }

        return $result;
    }

    public function duplicateTemplate(int $id): ?MenuTemplate
    {
        return $this->transaction(function () use ($id) {
            $source = $this->templateRepo->getById($id);

            if (! $source) {
                return null;
            }

            $newTemplate = $this->templateRepo->create([
                'template_name' => $source->template_name . ' (Copy)',
                'description' => $source->description,
                'kitchen_id' => $source->kitchen_id,
                'is_default' => false,
                'status' => $source->status,
            ]);

            foreach ($source->items as $item) {
                MenuTemplateItem::create([
                    'uuid' => \Str::uuid(),
                    'menu_template_id' => $newTemplate->id,
                    'day_name' => $item->day_name,
                    'meal_category_id' => $item->meal_category_id,
                    'meal_id' => $item->meal_id,
                    'meal_type_id' => $item->meal_type_id,
                    'display_order' => $item->display_order,
                ]);
            }

            CacheManager::flush('menu_template');

            $this->logInfo('Menu template duplicated', ['source_id' => $id, 'new_id' => $newTemplate->id]);
            $this->logActivity('menu_template_duplicated', $newTemplate);

            return $newTemplate->fresh();
        });
    }

    public function setDefault(int $id): ?MenuTemplate
    {
        return $this->transaction(function () use ($id) {
            $template = $this->templateRepo->getById($id);

            if (! $template) {
                return null;
            }

            $this->templateRepo->getAll($template->kitchen_id)->each(function ($t) {
                $this->templateRepo->update($t->id, ['is_default' => false]);
            });

            $updated = $this->templateRepo->update($id, ['is_default' => true]);

            CacheManager::flush('menu_template');

            $this->logInfo('Menu template set as default', ['template_id' => $id]);
            $this->logActivity('menu_template_set_default', $updated);

            return $updated;
        });
    }
}
