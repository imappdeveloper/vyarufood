<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Http\Resources\CustomerReview\CustomerReviewResource;
use App\Models\Customer;
use App\Models\Meal;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CustomerReviewController extends BaseController
{
    public function getMealReviews(string $mealUuid, Request $request): JsonResponse
    {
        try {
            $meal = Meal::where('uuid', $mealUuid)
                ->orWhere('slug', $mealUuid)
                ->first();

            if (!$meal) {
                return $this->notFoundResponse('Meal not found');
            }

            $perPage = min((int) $request->get('per_page', 15), 50);
            $query = Review::where('meal_id', $meal->id)
                ->where('status', 'approved')
                ->with('customer');

            if ($request->filled('rating')) {
                $query->where('rating', (int) $request->input('rating'));
            }

            if ($request->boolean('with_photo')) {
                $query->whereNotNull('photo')->where('photo', '!=', '');
            }

            $sort = $request->input('sort', 'newest');
            match ($sort) {
                'oldest' => $query->orderBy('created_at', 'asc'),
                'highest' => $query->orderBy('rating', 'desc'),
                'lowest' => $query->orderBy('rating', 'asc'),
                'with_photos' => $query->whereNotNull('photo')->where('photo', '!=', '')->orderBy('created_at', 'desc'),
                default => $query->orderBy('created_at', 'desc'),
            };

            $reviews = $query->paginate($perPage);

            $summary = Review::where('meal_id', $meal->id)
                ->where('status', 'approved')
                ->selectRaw('AVG(rating) as average_rating, COUNT(*) as total_reviews')
                ->first();

            $distribution = Review::where('meal_id', $meal->id)
                ->where('status', 'approved')
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray();

            $distributionFull = [];
            for ($i = 1; $i <= 5; $i++) {
                $distributionFull[$i] = [
                    'count' => $distribution[$i] ?? 0,
                    'percentage' => $summary->total_reviews > 0
                        ? round((($distribution[$i] ?? 0) / $summary->total_reviews) * 100, 1)
                        : 0,
                ];
            }

            $customerReview = null;
            $customer = Auth::guard('customer')->user();
            if ($customer) {
                $customerReview = Review::where('customer_id', $customer->id)
                    ->where('meal_id', $meal->id)
                    ->with('order')
                    ->first();
            }

            return response()->json([
                'success' => true,
                'message' => 'Reviews retrieved successfully',
                'data' => CustomerReviewResource::collection($reviews->items()),
                'meta' => [
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'per_page' => $reviews->perPage(),
                    'total' => $reviews->total(),
                ],
                'links' => [
                    'first' => $reviews->url(1),
                    'last' => $reviews->url($reviews->lastPage()),
                    'prev' => $reviews->previousPageUrl(),
                    'next' => $reviews->nextPageUrl(),
                ],
                'summary' => [
                    'average_rating' => round((float) ($summary->average_rating ?? 0), 1),
                    'total_reviews' => (int) ($summary->total_reviews ?? 0),
                    'distribution' => $distributionFull,
                ],
                'customer_review' => $customerReview ? new CustomerReviewResource($customerReview) : null,
            ]);
        } catch (\Exception $e) {
            \Log::error('getMealReviews failed: ' . $e->getMessage(), [
                'exception' => $e,
                'meal' => $mealUuid,
            ]);
            return $this->serverErrorResponse('Unable to load reviews.');
        }
    }

    public function getMyReviews(Request $request): JsonResponse
    {
        try {
            /** @var Customer $customer */
            $customer = $request->user();
            $perPage = min((int) $request->get('per_page', 15), 50);

            $query = Review::where('customer_id', $customer->id)
                ->with(['meal', 'order']);

            if ($request->filled('rating')) {
                $query->where('rating', (int) $request->input('rating'));
            }

            if ($request->boolean('with_photo')) {
                $query->whereNotNull('photo')->where('photo', '!=', '');
            }

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            $sort = $request->input('sort', 'newest');
            match ($sort) {
                'oldest' => $query->orderBy('created_at', 'asc'),
                'highest' => $query->orderBy('rating', 'desc'),
                'lowest' => $query->orderBy('rating', 'asc'),
                default => $query->orderBy('created_at', 'desc'),
            };

            $reviews = $query->paginate($perPage);

            return $this->paginatedResponse(
                CustomerReviewResource::collection($reviews->items()),
                'Reviews retrieved successfully',
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Unable to load reviews.');
        }
    }

    public function getReviewEligibility(string $orderUuid, Request $request): JsonResponse
    {
        try {
            /** @var Customer $customer */
            $customer = $request->user();

            $order = Order::where('uuid', $orderUuid)
                ->where('customer_id', $customer->id)
                ->with('orderItems.meal')
                ->first();

            if (!$order) {
                return $this->notFoundResponse('Order not found');
            }

            if (!in_array($order->order_status, ['delivered', 'completed'])) {
                return $this->successResponse([
                    'eligible' => false,
                    'reason' => 'Order has not been delivered yet.',
                ]);
            }

            $items = $order->orderItems->map(function (OrderItem $item) use ($customer) {
                $existingReview = Review::where('customer_id', $customer->id)
                    ->where('meal_id', $item->meal_id)
                    ->where('order_id', $order->id)
                    ->first();

                return [
                    'meal_id' => $item->meal_id,
                    'meal_name' => $item->meal_name,
                    'meal_image' => $item->meal?->meal_image
                        ? Storage::disk('public')->url($item->meal->meal_image)
                        : null,
                    'meal_slug' => $item->meal?->slug,
                    'can_review' => !$existingReview,
                    'review_uuid' => $existingReview?->uuid,
                    'existing_review' => $existingReview ? [
                        'uuid' => $existingReview->uuid,
                        'rating' => $existingReview->rating,
                        'title' => $existingReview->title,
                        'comment' => $existingReview->comment,
                        'photo' => $existingReview->photo
                            ? Storage::disk('public')->url($existingReview->photo)
                            : null,
                        'status' => $existingReview->status,
                        'created_at' => $existingReview->created_at->toIso8601String(),
                    ] : null,
                ];
            });

            return $this->successResponse([
                'eligible' => true,
                'order_uuid' => $order->uuid,
                'order_number_display' => 'ORD-' . str_pad((string) $order->id, 6, '0', STR_PAD_LEFT),
                'order_status' => $order->order_status,
                'items' => $items,
            ]);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Unable to check review eligibility.');
        }
    }

    public function createReview(Request $request): JsonResponse
    {
        try {
            /** @var Customer $customer */
            $customer = $request->user();

            $validated = $request->validate([
                'meal_id' => 'required|integer|exists:meals,id',
                'order_id' => 'nullable|integer|exists:orders,id',
                'rating' => 'required|integer|min:1|max:5',
                'title' => 'nullable|string|max:200',
                'comment' => 'nullable|string|max:2000',
                'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            ]);

            if ($validated['order_id']) {
                $order = Order::where('id', $validated['order_id'])
                    ->where('customer_id', $customer->id)
                    ->first();

                if (!$order) {
                    return $this->notFoundResponse('Order not found.');
                }

                if (!in_array($order->order_status, ['delivered', 'completed'])) {
                    return $this->errorResponse('You can only review meals from delivered orders.', 422);
                }
            }

            $existingReview = Review::where('customer_id', $customer->id)
                ->where('meal_id', $validated['meal_id'])
                ->where('order_id', $validated['order_id'] ?? null)
                ->first();

            if ($existingReview) {
                return $this->errorResponse('You have already reviewed this meal for this order.', 409);
            }

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $photoPath = $file->store('reviews', 'public');
            }

            $isVerified = false;
            if ($validated['order_id']) {
                $hasOrderItem = OrderItem::where('order_id', $validated['order_id'])
                    ->where('meal_id', $validated['meal_id'])
                    ->exists();
                $isVerified = $hasOrderItem;
            }

            $review = Review::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'customer_id' => $customer->id,
                'meal_id' => $validated['meal_id'],
                'order_id' => $validated['order_id'] ?? null,
                'rating' => $validated['rating'],
                'title' => $validated['title'] ?? null,
                'comment' => $validated['comment'] ?? null,
                'photo' => $photoPath,
                'status' => 'approved',
                'is_verified_purchase' => $isVerified,
            ]);

            return $this->createdResponse(
                new CustomerReviewResource($review->load('customer', 'meal')),
                'Review submitted successfully.',
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors(), 'Validation failed.');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Unable to submit review.');
        }
    }

    public function updateReview(string $uuid, Request $request): JsonResponse
    {
        try {
            /** @var Customer $customer */
            $customer = $request->user();

            $review = Review::where('uuid', $uuid)
                ->where('customer_id', $customer->id)
                ->first();

            if (!$review) {
                return $this->notFoundResponse('Review not found.');
            }

            $validated = $request->validate([
                'rating' => 'sometimes|integer|min:1|max:5',
                'title' => 'nullable|string|max:200',
                'comment' => 'nullable|string|max:2000',
                'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            ]);

            if ($request->hasFile('photo')) {
                if ($review->photo) {
                    Storage::disk('public')->delete($review->photo);
                }
                $validated['photo'] = $request->file('photo')->store('reviews', 'public');
            }

            $review->update($validated);

            return $this->successResponse(
                new CustomerReviewResource($review->fresh()->load('customer', 'meal')),
                'Review updated successfully.',
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors(), 'Validation failed.');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Unable to update review.');
        }
    }

    public function deleteReview(string $uuid, Request $request): JsonResponse
    {
        try {
            /** @var Customer $customer */
            $customer = $request->user();

            $review = Review::where('uuid', $uuid)
                ->where('customer_id', $customer->id)
                ->first();

            if (!$review) {
                return $this->notFoundResponse('Review not found.');
            }

            if ($review->photo) {
                Storage::disk('public')->delete($review->photo);
            }

            $review->delete();

            return $this->noContentResponse('Review deleted successfully.');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Unable to delete review.');
        }
    }

    public function checkEligibilityByMeal(string $mealUuid, Request $request): JsonResponse
    {
        try {
            /** @var Customer $customer */
            $customer = $request->user();

            $meal = Meal::where('uuid', $mealUuid)
                ->orWhere('slug', $mealUuid)
                ->first();

            if (!$meal) {
                return $this->notFoundResponse('Meal not found');
            }

            $deliveredOrder = Order::where('customer_id', $customer->id)
                ->whereIn('order_status', ['delivered', 'completed'])
                ->whereHas('orderItems', function ($q) use ($meal) {
                    $q->where('meal_id', $meal->id);
                })
                ->with('orderItems')
                ->first();

            $existingReview = Review::where('customer_id', $customer->id)
                ->where('meal_id', $meal->id)
                ->first();

            return $this->successResponse([
                'can_review' => $deliveredOrder && !$existingReview,
                'has_ordered' => (bool) $deliveredOrder,
                'has_reviewed' => (bool) $existingReview,
                'existing_review' => $existingReview ? new CustomerReviewResource($existingReview) : null,
                'order_id' => $deliveredOrder?->id,
            ]);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Unable to check eligibility.');
        }
    }
}
