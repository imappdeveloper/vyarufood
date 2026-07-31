<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Constants\AppConstants;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\UpdateNotificationPreferencesRequest;
use App\Http\Resources\Notification\NotificationPreferenceResource;
use App\Http\Resources\Notification\NotificationResource;
use App\Services\Notification\NotificationPreferenceServiceInterface;
use App\Services\Notification\NotificationServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerNotificationController extends BaseController
{
    public function __construct(
        private readonly NotificationServiceInterface $notificationService,
        private readonly NotificationPreferenceServiceInterface $preferenceService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $filters = $request->only(['search', 'channel', 'read', 'date_from', 'date_to']);

            $notifications = $this->notificationService->getCustomerNotifications($customerId, $filters, $perPage);

            return $this->paginatedResponse(
                JsonResource::collection($notifications),
                'Notifications retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $notification = $this->notificationService->getNotificationByUuid($uuid);

            if (! $notification) {
                return $this->notFoundResponse('Notification not found');
            }

            if ($notification->recipient_type !== 'customer' || $notification->recipient_id !== $customerId) {
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

    public function markAsRead(Request $request, string $uuid): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $notification = $this->notificationService->getNotificationByUuid($uuid);

            if (! $notification) {
                return $this->notFoundResponse('Notification not found');
            }

            if ($notification->recipient_type !== 'customer' || $notification->recipient_id !== $customerId) {
                return $this->notFoundResponse('Notification not found');
            }

            $notification = $this->notificationService->markAsRead($uuid);

            return $this->successResponse(
                new NotificationResource($notification),
                'Notification marked as read successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $count = $this->notificationService->markAllAsRead('customer', $customerId);

            return $this->successResponse(
                ['marked_count' => $count],
                'All notifications marked as read successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function preferences(Request $request): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $preferences = $this->preferenceService->getPreferences($customerId);

            return $this->successResponse(
                new NotificationPreferenceResource($preferences),
                'Notification preferences retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function updatePreferences(UpdateNotificationPreferencesRequest $request): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $preferences = $this->preferenceService->updatePreferences($customerId, $request->validated());

            return $this->successResponse(
                new NotificationPreferenceResource($preferences),
                'Notification preferences updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function unreadCount(Request $request): JsonResponse
    {
        try {
            $customerId = $request->user()->id;
            $count = $this->notificationService->getUnreadCount('customer', $customerId);

            return $this->successResponse(
                ['unread_count' => $count],
                'Unread count retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
