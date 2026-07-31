<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Constants\AppConstants;
use App\Http\Resources\CustomerReview\CustomerReviewResource;
use App\Http\Resources\Meal\MealResource;
use App\Http\Resources\Meal\MealCategoryResource;
use App\Http\Resources\SubscriptionPlan\SubscriptionPlanResource;
use App\Http\Resources\WeeklyMenu\WeeklyMenuResource;
use App\Models\Customer;
use App\Models\Meal;
use App\Models\MealCategory;
use App\Models\MealType;
use App\Models\Order;
use App\Models\Review;
use App\Models\CmsPage;
use App\Models\SubscriptionPlan;
use App\Models\WeeklyMenu;
use App\Models\Master\Pincode;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerBrowseController extends BaseController
{
    public function getCategories(Request $request): JsonResponse
    {
        try {
            $categories = MealCategory::query()
                ->where('status', 'active')
                ->orderBy('display_order')
                ->orderBy('name')
                ->get();

            return $this->successResponse(
                MealCategoryResource::collection($categories),
                'Categories retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getCategoryBySlug(string $slug): JsonResponse
    {
        try {
            $category = MealCategory::where('slug', $slug)->where('status', 'active')->first();
            if (!$category) {
                return $this->notFoundResponse('Category not found');
            }
            return $this->successResponse(new MealCategoryResource($category));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getMealTypes(Request $request): JsonResponse
    {
        try {
            $types = MealType::query()
                ->where('status', 'active')
                ->orderBy('display_order')
                ->orderBy('name')
                ->get();

            return $this->successResponse(
                \App\Http\Resources\Meal\MealTypeResource::collection($types),
                'Meal types retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getMeals(Request $request): JsonResponse
    {
        try {
            $query = Meal::query()
                ->where('status', 'active')
                ->with(['category', 'mealType', 'kitchen']);

            if ($request->has('category_id')) {
                $query->where('category_id', $request->input('category_id'));
            }
            if ($request->has('meal_type_id')) {
                $query->where('meal_type_id', $request->input('meal_type_id'));
            }
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('short_description', 'LIKE', "%{$search}%");
                });
            }
            if ($request->boolean('featured')) {
                $query->where('is_featured', true);
            }
            if ($request->boolean('recommended')) {
                $query->where('is_recommended', true);
            }
            if ($request->boolean('bestseller')) {
                $query->where('is_bestseller', true);
            }
            if ($request->boolean('new')) {
                $query->where('is_new', true);
            }

            $sort = $request->input('sort', 'display_order');
            $order = $request->input('order', 'asc');
            $perPage = min((int) $request->input('per_page', 20), AppConstants::PER_PAGE_MAX);

            $meals = $query->orderBy($sort, $order)->paginate($perPage);

            return $this->paginatedResponse(
                MealResource::collection($meals),
                'Meals retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getMealBySlug(string $slug): JsonResponse
    {
        try {
            $meal = Meal::query()
                ->where('slug', $slug)
                ->orWhere('uuid', $slug)
                ->where('status', 'active')
                ->with(['category', 'mealType', 'kitchen'])
                ->first();

            if (!$meal) {
                return $this->notFoundResponse('Meal not found');
            }

            return $this->successResponse(new MealResource($meal));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getSubscriptionPlans(Request $request): JsonResponse
    {
        try {
            $plans = SubscriptionPlan::query()
                ->where('status', 'active')
                ->with(['mealCategory', 'kitchen'])
                ->orderBy('display_order')
                ->orderBy('plan_name')
                ->paginate(min((int) $request->input('per_page', 20), AppConstants::PER_PAGE_MAX));

            return $this->paginatedResponse(
                SubscriptionPlanResource::collection($plans),
                'Subscription plans retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getSubscriptionPlanBySlug(string $slug): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::query()
                ->where('slug', $slug)
                ->orWhere('uuid', $slug)
                ->where('status', 'active')
                ->with(['mealCategory', 'kitchen', 'planMeals'])
                ->first();

            if (!$plan) {
                return $this->notFoundResponse('Subscription plan not found');
            }

            return $this->successResponse(new SubscriptionPlanResource($plan));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getCurrentWeekMenu(Request $request): JsonResponse
    {
        try {
            $today = now()->toDateString();

            $menu = WeeklyMenu::withoutTrashed()
                ->where('status', 'published')
                ->where('week_start_date', '<=', $today)
                ->where('week_end_date', '>=', $today)
                ->with(['kitchen', 'items.meal', 'items.mealCategory', 'items.mealType'])
                ->orderBy('week_start_date', 'desc')
                ->first();

            if (!$menu) {
                $menu = WeeklyMenu::withoutTrashed()
                    ->where('status', 'published')
                    ->where('week_start_date', '>', $today)
                    ->with(['kitchen', 'items.meal', 'items.mealCategory', 'items.mealType'])
                    ->orderBy('week_start_date', 'asc')
                    ->first();
            }

            if (!$menu) {
                return $this->successResponse(null, 'No weekly menu available');
            }

            return $this->successResponse(new WeeklyMenuResource($menu), 'Weekly menu retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getRelatedMeals(string $slug): JsonResponse
    {
        try {
            $meal = Meal::query()
                ->where('slug', $slug)
                ->orWhere('uuid', $slug)
                ->where('status', 'active')
                ->first();

            if (!$meal) {
                return $this->notFoundResponse('Meal not found');
            }

            $relatedMeals = Meal::query()
                ->where('status', 'active')
                ->where('id', '!=', $meal->id)
                ->where(function ($q) use ($meal) {
                    $q->where('category_id', $meal->category_id)
                      ->orWhere('meal_type_id', $meal->meal_type_id);
                })
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('is_bestseller', 'desc')
                ->orderBy('is_featured', 'desc')
                ->orderBy('display_order')
                ->limit(8)
                ->get();

            return $this->successResponse(
                MealResource::collection($relatedMeals),
                'Related meals retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getSpecialMeals(): JsonResponse
    {
        try {
            $meals = Meal::query()
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->where('is_bestseller', true)
                          ->orWhere('is_featured', true);
                })
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('display_order')
                ->limit(6)
                ->get();

            return $this->successResponse(
                MealResource::collection($meals),
                'Special meals retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getHomeReviews(Request $request): JsonResponse
    {
        try {
            $perPage = min((int) $request->get('per_page', 6), 12);

            $reviews = Review::query()
                ->where('status', 'approved')
                ->with('customer')
                ->orderBy('is_featured', 'desc')
                ->orderBy('rating', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit($perPage)
                ->get();

            return $this->successResponse(
                CustomerReviewResource::collection($reviews),
                'Home reviews retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function checkPincode(string $pincode): JsonResponse
    {
        try {
            $pincodeRecord = Pincode::query()
                ->where('pincode', $pincode)
                ->where('status', 'active')
                ->where('is_serviceable', true)
                ->with('deliveryZone')
                ->first();

            if (!$pincodeRecord) {
                return $this->successResponse([
                    'deliverable' => false,
                    'pincode' => $pincode,
                    'message' => 'Sorry, we do not deliver to this pincode yet.',
                ], 'Pincode check completed');
            }

            $zone = $pincodeRecord->deliveryZone;

            return $this->successResponse([
                'deliverable' => true,
                'pincode_id' => $pincodeRecord->id,
                'pincode' => $pincode,
                'message' => 'Great! We deliver to your area.',
                'zone_name' => $zone?->zone_name,
                'estimated_delivery_time' => $zone?->estimated_delivery_time ?? 30,
                'delivery_charge' => (float) ($zone?->delivery_charge ?? 0),
                'free_delivery_above' => (float) ($zone?->free_delivery_above ?? 0),
                'minimum_order_amount' => (float) ($zone?->minimum_order_amount ?? 0),
                'city' => $pincodeRecord->office_name ?? $pincodeRecord->district,
            ], 'Pincode check completed');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getHomeStats(): JsonResponse
    {
        try {
            $stats = [
                'total_meals' => Meal::where('status', 'active')->count(),
                'happy_customers' => Customer::count(),
                'total_deliveries' => Order::where('order_status', 'delivered')->count(),
                'average_rating' => round((float) Review::where('status', 'approved')->avg('rating'), 1),
                'total_reviews' => Review::where('status', 'approved')->count(),
            ];

            return $this->successResponse($stats, 'Home stats retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function submitContact(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'subject' => 'nullable|string|max:255',
                'message' => 'required|string|max:5000',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors()->toArray());
            }

            DB::table('activity_log')->insert([
                'log_name' => 'contact_submission',
                'description' => 'Contact form submission from ' . $request->input('name'),
                'subject_type' => 'ContactSubmission',
                'event' => 'submitted',
                'properties' => json_encode([
                    'name' => $request->input('name'),
                    'email' => $request->input('email'),
                    'phone' => $request->input('phone'),
                    'subject' => $request->input('subject'),
                    'message' => $request->input('message'),
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $this->successResponse(null, 'Thank you! We have received your message and will get back to you within 24 hours.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getCompanyInfo(): JsonResponse
    {
        try {
            $keys = ['company_name', 'company_address', 'company_phone', 'company_email', 'support_email', 'support_phone'];
            $settings = DB::table('system_settings')
                ->whereIn('setting_key', $keys)
                ->where('status', 'active')
                ->pluck('setting_value', 'setting_key');

            $officeHours = [
                ['day' => 'Monday - Friday', 'time' => '9:00 AM - 8:00 PM', 'open' => true],
                ['day' => 'Saturday', 'time' => '9:00 AM - 6:00 PM', 'open' => true],
                ['day' => 'Sunday', 'time' => '10:00 AM - 4:00 PM', 'open' => true],
            ];

            return $this->successResponse([
                'company_name' => $settings['company_name'] ?? 'Vyaru Tiffin',
                'address' => $settings['company_address'] ?? 'Mumbai, Maharashtra, India',
                'phone' => $settings['company_phone'] ?? $settings['support_phone'] ?? '+91 98765 43210',
                'email' => $settings['company_email'] ?? $settings['support_email'] ?? 'hello@vyarutiffin.com',
                'office_hours' => $officeHours,
            ], 'Company info retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getMaintenanceStatusForPublic(): JsonResponse
    {
        try {
            $enabled = \Illuminate\Support\Facades\DB::table('system_settings')
                ->where('setting_key', 'maintenance_mode')
                ->where('setting_value', 'true')
                ->where('status', 'active')
                ->exists();
            $message = \Illuminate\Support\Facades\DB::table('system_settings')
                ->where('setting_key', 'maintenance_message')
                ->value('setting_value');

            return $this->successResponse([
                'maintenance_mode' => $enabled,
                'message' => $message ?: 'We are currently under scheduled maintenance. Please check back shortly.',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getCmsPage(string $slug): JsonResponse
    {
        try {
            $page = CmsPage::where('slug', $slug)
                ->where('status', 'published')
                ->first();

            if (!$page) {
                return $this->notFoundResponse('Page not found');
            }

            return $this->successResponse([
                'page_code' => $page->page_code,
                'page_title' => $page->page_title,
                'slug' => $page->slug,
                'content' => $page->content,
                'meta_title' => $page->meta_title,
                'meta_description' => $page->meta_description,
                'meta_keywords' => $page->meta_keywords,
                'updated_at' => $page->updated_at,
            ], 'CMS page retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
