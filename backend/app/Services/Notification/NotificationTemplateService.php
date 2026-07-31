<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\NotificationTemplate;
use App\Repositories\Notification\NotificationTemplateRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationTemplateService extends BaseService implements NotificationTemplateServiceInterface
{
    protected string $moduleName = 'notification_template';

    public function __construct(
        protected readonly NotificationTemplateRepositoryInterface $templateRepo,
    ) {}

    public function getPaginatedTemplates(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->templateRepo->getPaginated($filters, $perPage);
    }

    public function getTemplateById(int $id): ?NotificationTemplate
    {
        return $this->templateRepo->findById($id);
    }

    public function getTemplateByCode(string $code): ?NotificationTemplate
    {
        return $this->templateRepo->findByCode($code);
    }

    public function createTemplate(array $data): NotificationTemplate
    {
        return $this->transaction(function () use ($data) {
            $template = $this->templateRepo->create($data);

            $this->logInfo('Template created', ['template_id' => $template->id, 'template_code' => $template->template_code]);
            $this->logActivity('notification_template_created', $template);

            return $template;
        });
    }

    public function updateTemplate(int $id, array $data): ?NotificationTemplate
    {
        return $this->transaction(function () use ($id, $data) {
            $template = $this->templateRepo->findById($id);

            if (! $template) {
                return null;
            }

            $updated = $this->templateRepo->update($template, $data);

            $this->logInfo('Template updated', ['template_id' => $id]);
            $this->logActivity('notification_template_updated', $updated);

            return $updated;
        });
    }

    public function deleteTemplate(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $template = $this->templateRepo->findById($id);

            if (! $template) {
                return false;
            }

            $result = $template->delete();

            if ($result) {
                $this->logInfo('Template deleted', ['template_id' => $id]);
                $this->logActivity('notification_template_deleted', $template);
            }

            return $result;
        });
    }

    public function renderTemplate(string $templateCode, array $variables = []): array
    {
        $template = $this->templateRepo->findByCode($templateCode);

        if (! $template) {
            throw new \InvalidArgumentException("Template not found with code: {$templateCode}");
        }

        $subject = $this->replacePlaceholders($template->subject ?? '', $variables);
        $body = $this->replacePlaceholders($template->body ?? '', $variables);
        $htmlBody = ! empty($template->html_body)
            ? $this->replacePlaceholders($template->html_body, $variables)
            : null;

        $this->logInfo('Template rendered', [
            'template_code' => $templateCode,
            'variables_count' => count($variables),
        ]);

        return [
            'template_id' => $template->id,
            'template_code' => $template->template_code,
            'channel' => $template->channel,
            'notification_type' => $template->notification_type,
            'subject' => $subject,
            'body' => $body,
            'html_body' => $htmlBody,
        ];
    }

    private function replacePlaceholders(string $content, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $content = str_replace('{' . $key . '}', (string) $value, $content);
        }

        return $content;
    }
}
