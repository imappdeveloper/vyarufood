<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\BroadcastMessageRequest;
use App\Http\Requests\Notification\SendNotificationRequest;
use App\Http\Resources\Notification\NotificationResource;
use App\Services\Notification\NotificationServiceInterface;
use App\Services\Notification\NotificationTemplateServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationController extends BaseController
{
    public function __construct(
        private readonly NotificationServiceInterface $notificationService,
        private readonly NotificationTemplateServiceInterface $templateService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $filters = $request->only([
                'search', 'notification_number', 'title', 'channel',
                'delivery_status', 'priority', 'recipient_type',
                'event_name', 'date_from', 'date_to',
            ]);

            $notifications = $this->notificationService->getPaginatedNotifications($filters, $perPage);

            return $this->paginatedResponse(
                JsonResource::collection($notifications),
                'Notifications retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $uuid): JsonResponse
    {
        try {
            $notification = $this->notificationService->getNotificationByUuid($uuid);
            if (! $notification) {
                return $this->notFoundResponse('Notification not found');
            }

            $notification->load('logs');

            return $this->successResponse(
                new NotificationResource($notification),
                'Notification retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(SendNotificationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $notification = $this->notificationService->sendNotification($validated);

            return $this->createdResponse(
                new NotificationResource($notification),
                'Notification sent successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function broadcast(BroadcastMessageRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $count = $this->notificationService->broadcastMessage($validated);

            return $this->successResponse(
                ['notifications_sent' => $count],
                'Message broadcast successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function cancel(string $uuid): JsonResponse
    {
        try {
            $notification = $this->notificationService->cancelNotification($uuid);

            return $this->successResponse(
                new NotificationResource($notification),
                'Notification cancelled successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkCancel(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:notifications,id',
            ]);

            $cancelled = 0;
            foreach ($request->input('ids') as $id) {
                try {
                    $notification = $this->notificationService->getNotificationById($id);
                    if ($notification) {
                        $this->notificationService->cancelNotification($notification->uuid);
                        $cancelled++;
                    }
                } catch (\Exception) {
                    continue;
                }
            }

            return $this->successResponse(
                ['cancelled' => $cancelled],
                "{$cancelled} notifications cancelled successfully"
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function dashboardStats(): JsonResponse
    {
        try {
            $stats = $this->notificationService->getDashboardStats();

            return $this->successResponse($stats, 'Notification dashboard stats retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function deliveryStats(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['date_from', 'date_to', 'channel']);
            $stats = $this->notificationService->getDeliveryStats($filters);

            return $this->successResponse($stats, 'Delivery stats retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function queueStats(): JsonResponse
    {
        try {
            $stats = $this->notificationService->getDashboardStats();
            $queueStats = [
                'pending' => $stats['pending'] ?? 0,
                'queued' => $stats['queued'] ?? 0,
                'sent' => $stats['sent'] ?? 0,
            ];

            return $this->successResponse($queueStats, 'Queue stats retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
