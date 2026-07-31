<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Controllers\BaseController;
use App\Http\Resources\Notification\NotificationLogResource;
use App\Models\NotificationLog;
use App\Services\Notification\NotificationServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationLogController extends BaseController
{
    public function __construct(
        private readonly NotificationServiceInterface $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $query = NotificationLog::query();

            if ($request->filled('notification_id')) {
                $query->where('notification_id', $request->input('notification_id'));
            }

            if ($request->filled('provider')) {
                $query->where('provider', $request->input('provider'));
            }

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            $query->orderBy('created_at', 'desc');
            $paginator = $query->paginate($perPage);

            return $this->paginatedResponse(
                NotificationLogResource::collection($paginator),
                'Notification logs retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
