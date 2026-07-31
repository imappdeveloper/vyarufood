<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \App\Events\Country\CountryCreated::class => [
            \App\Listeners\Country\ClearCountryCache::class,
            \App\Listeners\Country\LogCountryActivity::class,
        ],
        \App\Events\Country\CountryUpdated::class => [
            \App\Listeners\Country\ClearCountryCache::class,
            \App\Listeners\Country\LogCountryActivity::class,
        ],
        \App\Events\Country\CountryDeleted::class => [
            \App\Listeners\Country\ClearCountryCache::class,
            \App\Listeners\Country\LogCountryActivity::class,
        ],
        \App\Events\Country\CountryRestored::class => [
            \App\Listeners\Country\ClearCountryCache::class,
            \App\Listeners\Country\LogCountryActivity::class,
        ],
        \App\Events\Country\CountryStatusChanged::class => [
            \App\Listeners\Country\ClearCountryCache::class,
            \App\Listeners\Country\LogCountryActivity::class,
        ],
        \App\Events\Country\CountryDefaultChanged::class => [
            \App\Listeners\Country\ClearCountryCache::class,
            \App\Listeners\Country\LogCountryActivity::class,
        ],
        \App\Events\State\StateCreated::class => [
            \App\Listeners\State\ClearStateCache::class,
            \App\Listeners\State\LogStateActivity::class,
        ],
        \App\Events\State\StateUpdated::class => [
            \App\Listeners\State\ClearStateCache::class,
            \App\Listeners\State\LogStateActivity::class,
        ],
        \App\Events\State\StateDeleted::class => [
            \App\Listeners\State\ClearStateCache::class,
            \App\Listeners\State\LogStateActivity::class,
        ],
        \App\Events\State\StateRestored::class => [
            \App\Listeners\State\ClearStateCache::class,
            \App\Listeners\State\LogStateActivity::class,
        ],
        \App\Events\State\StateStatusChanged::class => [
            \App\Listeners\State\ClearStateCache::class,
            \App\Listeners\State\LogStateActivity::class,
        ],
        \App\Events\State\StateDefaultChanged::class => [
            \App\Listeners\State\ClearStateCache::class,
            \App\Listeners\State\LogStateActivity::class,
        ],
        \App\Events\City\CityCreated::class => [
            \App\Listeners\City\ClearCityCache::class,
            \App\Listeners\City\LogCityActivity::class,
        ],
        \App\Events\City\CityUpdated::class => [
            \App\Listeners\City\ClearCityCache::class,
            \App\Listeners\City\LogCityActivity::class,
        ],
        \App\Events\City\CityDeleted::class => [
            \App\Listeners\City\ClearCityCache::class,
            \App\Listeners\City\LogCityActivity::class,
        ],
        \App\Events\City\CityRestored::class => [
            \App\Listeners\City\ClearCityCache::class,
            \App\Listeners\City\LogCityActivity::class,
        ],
        \App\Events\City\CityStatusChanged::class => [
            \App\Listeners\City\ClearCityCache::class,
            \App\Listeners\City\LogCityActivity::class,
        ],
        \App\Events\City\CityDefaultChanged::class => [
            \App\Listeners\City\ClearCityCache::class,
            \App\Listeners\City\LogCityActivity::class,
        ],
        \App\Events\Area\AreaCreated::class => [
            \App\Listeners\Area\ClearAreaCache::class,
            \App\Listeners\Area\LogAreaActivity::class,
        ],
        \App\Events\Area\AreaUpdated::class => [
            \App\Listeners\Area\ClearAreaCache::class,
            \App\Listeners\Area\LogAreaActivity::class,
        ],
        \App\Events\Area\AreaDeleted::class => [
            \App\Listeners\Area\ClearAreaCache::class,
            \App\Listeners\Area\LogAreaActivity::class,
        ],
        \App\Events\Area\AreaRestored::class => [
            \App\Listeners\Area\ClearAreaCache::class,
            \App\Listeners\Area\LogAreaActivity::class,
        ],
        \App\Events\Area\AreaStatusChanged::class => [
            \App\Listeners\Area\ClearAreaCache::class,
            \App\Listeners\Area\LogAreaActivity::class,
        ],
        \App\Events\Area\AreaDefaultChanged::class => [
            \App\Listeners\Area\ClearAreaCache::class,
            \App\Listeners\Area\LogAreaActivity::class,
        ],
        \App\Events\DeliveryZone\DeliveryZoneCreated::class => [
            \App\Listeners\DeliveryZone\ClearDeliveryZoneCache::class,
            \App\Listeners\DeliveryZone\LogDeliveryZoneActivity::class,
        ],
        \App\Events\DeliveryZone\DeliveryZoneUpdated::class => [
            \App\Listeners\DeliveryZone\ClearDeliveryZoneCache::class,
            \App\Listeners\DeliveryZone\LogDeliveryZoneActivity::class,
        ],
        \App\Events\DeliveryZone\DeliveryZoneDeleted::class => [
            \App\Listeners\DeliveryZone\ClearDeliveryZoneCache::class,
            \App\Listeners\DeliveryZone\LogDeliveryZoneActivity::class,
        ],
        \App\Events\DeliveryZone\DeliveryZoneRestored::class => [
            \App\Listeners\DeliveryZone\ClearDeliveryZoneCache::class,
            \App\Listeners\DeliveryZone\LogDeliveryZoneActivity::class,
        ],
        \App\Events\DeliveryZone\DeliveryZoneForceDeleted::class => [
            \App\Listeners\DeliveryZone\ClearDeliveryZoneCache::class,
            \App\Listeners\DeliveryZone\LogDeliveryZoneActivity::class,
        ],
        \App\Events\DeliveryZone\DeliveryZoneStatusChanged::class => [
            \App\Listeners\DeliveryZone\ClearDeliveryZoneCache::class,
            \App\Listeners\DeliveryZone\LogDeliveryZoneActivity::class,
        ],
        \App\Events\Pincode\PincodeCreated::class => [
            \App\Listeners\Pincode\ClearPincodeCache::class,
            \App\Listeners\Pincode\LogPincodeActivity::class,
        ],
        \App\Events\Pincode\PincodeUpdated::class => [
            \App\Listeners\Pincode\ClearPincodeCache::class,
            \App\Listeners\Pincode\LogPincodeActivity::class,
        ],
        \App\Events\Pincode\PincodeDeleted::class => [
            \App\Listeners\Pincode\ClearPincodeCache::class,
            \App\Listeners\Pincode\LogPincodeActivity::class,
        ],
        \App\Events\Pincode\PincodeRestored::class => [
            \App\Listeners\Pincode\ClearPincodeCache::class,
            \App\Listeners\Pincode\LogPincodeActivity::class,
        ],
        \App\Events\Pincode\PincodeForceDeleted::class => [
            \App\Listeners\Pincode\ClearPincodeCache::class,
            \App\Listeners\Pincode\LogPincodeActivity::class,
        ],
        \App\Events\Pincode\PincodeStatusChanged::class => [
            \App\Listeners\Pincode\ClearPincodeCache::class,
            \App\Listeners\Pincode\LogPincodeActivity::class,
        ],
        \App\Events\DeliverySlot\DeliverySlotCreated::class => [
            \App\Listeners\DeliverySlot\ClearDeliverySlotCache::class,
            \App\Listeners\DeliverySlot\LogDeliverySlotActivity::class,
        ],
        \App\Events\DeliverySlot\DeliverySlotUpdated::class => [
            \App\Listeners\DeliverySlot\ClearDeliverySlotCache::class,
            \App\Listeners\DeliverySlot\LogDeliverySlotActivity::class,
        ],
        \App\Events\DeliverySlot\DeliverySlotDeleted::class => [
            \App\Listeners\DeliverySlot\ClearDeliverySlotCache::class,
            \App\Listeners\DeliverySlot\LogDeliverySlotActivity::class,
        ],
        \App\Events\DeliverySlot\DeliverySlotRestored::class => [
            \App\Listeners\DeliverySlot\ClearDeliverySlotCache::class,
            \App\Listeners\DeliverySlot\LogDeliverySlotActivity::class,
        ],
        \App\Events\DeliverySlot\DeliverySlotForceDeleted::class => [
            \App\Listeners\DeliverySlot\ClearDeliverySlotCache::class,
            \App\Listeners\DeliverySlot\LogDeliverySlotActivity::class,
        ],
        \App\Events\DeliverySlot\DeliverySlotStatusChanged::class => [
            \App\Listeners\DeliverySlot\ClearDeliverySlotCache::class,
            \App\Listeners\DeliverySlot\LogDeliverySlotActivity::class,
        ],
        \App\Events\Customer\CustomerCreated::class => [
            \App\Listeners\Customer\ClearCustomerCache::class,
            \App\Listeners\Customer\LogCustomerActivity::class,
        ],
        \App\Events\Customer\CustomerUpdated::class => [
            \App\Listeners\Customer\ClearCustomerCache::class,
            \App\Listeners\Customer\LogCustomerActivity::class,
        ],
        \App\Events\Customer\CustomerDeleted::class => [
            \App\Listeners\Customer\ClearCustomerCache::class,
            \App\Listeners\Customer\LogCustomerActivity::class,
        ],
        \App\Events\Customer\CustomerRestored::class => [
            \App\Listeners\Customer\ClearCustomerCache::class,
            \App\Listeners\Customer\LogCustomerActivity::class,
        ],
        \App\Events\Customer\CustomerForceDeleted::class => [
            \App\Listeners\Customer\ClearCustomerCache::class,
            \App\Listeners\Customer\LogCustomerActivity::class,
        ],
        \App\Events\Customer\CustomerStatusChanged::class => [
            \App\Listeners\Customer\ClearCustomerCache::class,
            \App\Listeners\Customer\LogCustomerActivity::class,
        ],
        \App\Events\CustomerAddress\CustomerAddressCreated::class => [
            \App\Listeners\CustomerAddress\ClearCustomerAddressCache::class,
            \App\Listeners\CustomerAddress\LogCustomerAddressActivity::class,
        ],
        \App\Events\CustomerAddress\CustomerAddressUpdated::class => [
            \App\Listeners\CustomerAddress\ClearCustomerAddressCache::class,
            \App\Listeners\CustomerAddress\LogCustomerAddressActivity::class,
        ],
        \App\Events\CustomerAddress\CustomerAddressDeleted::class => [
            \App\Listeners\CustomerAddress\ClearCustomerAddressCache::class,
            \App\Listeners\CustomerAddress\LogCustomerAddressActivity::class,
        ],
        \App\Events\CustomerAddress\CustomerAddressRestored::class => [
            \App\Listeners\CustomerAddress\ClearCustomerAddressCache::class,
            \App\Listeners\CustomerAddress\LogCustomerAddressActivity::class,
        ],
        \App\Events\CustomerAddress\CustomerAddressForceDeleted::class => [
            \App\Listeners\CustomerAddress\ClearCustomerAddressCache::class,
            \App\Listeners\CustomerAddress\LogCustomerAddressActivity::class,
        ],
        \App\Events\CustomerAddress\CustomerAddressDefaultChanged::class => [
            \App\Listeners\CustomerAddress\ClearCustomerAddressCache::class,
            \App\Listeners\CustomerAddress\LogCustomerAddressActivity::class,
        ],
        \App\Events\Kitchen\KitchenCreated::class => [
            \App\Listeners\Kitchen\ClearKitchenCache::class,
            \App\Listeners\Kitchen\LogKitchenActivity::class,
        ],
        \App\Events\Kitchen\KitchenUpdated::class => [
            \App\Listeners\Kitchen\ClearKitchenCache::class,
            \App\Listeners\Kitchen\LogKitchenActivity::class,
        ],
        \App\Events\Kitchen\KitchenDeleted::class => [
            \App\Listeners\Kitchen\ClearKitchenCache::class,
            \App\Listeners\Kitchen\LogKitchenActivity::class,
        ],
        \App\Events\Kitchen\KitchenRestored::class => [
            \App\Listeners\Kitchen\ClearKitchenCache::class,
            \App\Listeners\Kitchen\LogKitchenActivity::class,
        ],
        \App\Events\Kitchen\KitchenForceDeleted::class => [
            \App\Listeners\Kitchen\ClearKitchenCache::class,
            \App\Listeners\Kitchen\LogKitchenActivity::class,
        ],
        \App\Events\Kitchen\KitchenDefaultChanged::class => [
            \App\Listeners\Kitchen\ClearKitchenCache::class,
            \App\Listeners\Kitchen\LogKitchenActivity::class,
        ],
        \App\Events\Kitchen\KitchenWorkingDayUpdated::class => [
            \App\Listeners\Kitchen\ClearKitchenWorkingDayCache::class,
            \App\Listeners\Kitchen\LogKitchenWorkingDayActivity::class,
        ],
        \App\Events\Kitchen\KitchenHolidayCreated::class => [
            \App\Listeners\Kitchen\ClearKitchenHolidayCache::class,
            \App\Listeners\Kitchen\LogKitchenHolidayActivity::class,
        ],
        \App\Events\Kitchen\KitchenHolidayDeleted::class => [
            \App\Listeners\Kitchen\ClearKitchenHolidayCache::class,
            \App\Listeners\Kitchen\LogKitchenHolidayActivity::class,
        ],
        \App\Events\Kitchen\KitchenCapacityUpdated::class => [
            \App\Listeners\Kitchen\ClearKitchenCapacityCache::class,
            \App\Listeners\Kitchen\LogKitchenCapacityActivity::class,
        ],
        \App\Events\Kitchen\ProductionScheduleCreated::class => [
            \App\Listeners\Kitchen\ClearProductionScheduleCache::class,
            \App\Listeners\Kitchen\LogProductionScheduleActivity::class,
        ],
        \App\Events\Kitchen\ProductionScheduleCompleted::class => [
            \App\Listeners\Kitchen\ClearProductionScheduleCache::class,
            \App\Listeners\Kitchen\LogProductionScheduleActivity::class,
        ],
        \App\Events\Meal\MealCategoryCreated::class => [
            \App\Listeners\Meal\ClearMealCategoryCache::class,
            \App\Listeners\Meal\LogMealCategoryActivity::class,
        ],
        \App\Events\Meal\MealCategoryUpdated::class => [
            \App\Listeners\Meal\ClearMealCategoryCache::class,
            \App\Listeners\Meal\LogMealCategoryActivity::class,
        ],
        \App\Events\Meal\MealCategoryDeleted::class => [
            \App\Listeners\Meal\ClearMealCategoryCache::class,
            \App\Listeners\Meal\LogMealCategoryActivity::class,
        ],
        \App\Events\Meal\MealTypeCreated::class => [
            \App\Listeners\Meal\ClearMealTypeCache::class,
            \App\Listeners\Meal\LogMealTypeActivity::class,
        ],
        \App\Events\Meal\MealTypeUpdated::class => [
            \App\Listeners\Meal\ClearMealTypeCache::class,
            \App\Listeners\Meal\LogMealTypeActivity::class,
        ],
        \App\Events\Meal\MealTypeDeleted::class => [
            \App\Listeners\Meal\ClearMealTypeCache::class,
            \App\Listeners\Meal\LogMealTypeActivity::class,
        ],
        \App\Events\Meal\MealCreated::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealUpdated::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealDeleted::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealRestored::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealPriceChanged::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealStatusChanged::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealFeaturedChanged::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\Meal\MealRecommendationChanged::class => [
            \App\Listeners\Meal\ClearMealCache::class,
            \App\Listeners\Meal\LogMealActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuCreated::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuUpdated::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuPublished::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuUnpublished::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuDeleted::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuRestored::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuItemCreated::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuItemUpdated::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\WeeklyMenuItemDeleted::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\CustomerMealSelectionCreated::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\CustomerMealSelectionUpdated::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\WeeklyMenu\CustomerMealSelectionCancelled::class => [
            \App\Listeners\WeeklyMenu\ClearWeeklyMenuCache::class,
            \App\Listeners\WeeklyMenu\LogWeeklyMenuActivity::class,
        ],
        \App\Events\MonthlyMenu\MonthlyMenuCreated::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\MonthlyMenuUpdated::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\MonthlyMenuDeleted::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\MonthlyMenuPublished::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\MonthlyMenuApproved::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\WeeklyMenusGenerated::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\MenuTemplateCreated::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\MonthlyMenu\MenuTemplateApplied::class => [
            \App\Listeners\MonthlyMenu\ClearMonthlyMenuCache::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanCreated::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanUpdated::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanDeleted::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanRestored::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanActivated::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanDeactivated::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanPriceChanged::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\SubscriptionPlan\SubscriptionPlanDuplicated::class => [
            \App\Listeners\SubscriptionPlan\ClearSubscriptionPlanCache::class,
            \App\Listeners\SubscriptionPlan\LogSubscriptionPlanActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionCreated::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionUpdated::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionDeleted::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionStatusChanged::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionActivated::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionPaused::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionResumed::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionCancelled::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionRenewed::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\CustomerSubscription\CustomerSubscriptionExpired::class => [
            \App\Listeners\CustomerSubscription\ClearCustomerSubscriptionCache::class,
            \App\Listeners\CustomerSubscription\LogCustomerSubscriptionActivity::class,
        ],
        \App\Events\Order\OrderCreated::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderUpdated::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderDeleted::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderStatusChanged::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderConfirmed::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderPrepared::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderReady::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderDispatched::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderDelivered::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderCancelled::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\Order\OrderRefunded::class => [
            \App\Listeners\Order\ClearOrderCache::class,
            \App\Listeners\Order\LogOrderActivity::class,
        ],
        \App\Events\ProductionBatch\ProductionBatchCreated::class => [
            \App\Listeners\ProductionBatch\ClearProductionCache::class,
            \App\Listeners\ProductionBatch\LogProductionActivity::class,
        ],
        \App\Events\ProductionBatch\ProductionBatchUpdated::class => [
            \App\Listeners\ProductionBatch\ClearProductionCache::class,
            \App\Listeners\ProductionBatch\LogProductionActivity::class,
        ],
        \App\Events\ProductionBatch\ProductionBatchDeleted::class => [
            \App\Listeners\ProductionBatch\ClearProductionCache::class,
            \App\Listeners\ProductionBatch\LogProductionActivity::class,
        ],
        \App\Events\ProductionBatch\ProductionStatusChanged::class => [
            \App\Listeners\ProductionBatch\ClearProductionCache::class,
            \App\Listeners\ProductionBatch\LogProductionActivity::class,
        ],
        \App\Events\ProductionBatch\ProductionBatchCompleted::class => [
            \App\Listeners\ProductionBatch\ClearProductionCache::class,
            \App\Listeners\ProductionBatch\LogProductionActivity::class,
        ],
        \App\Events\ProductionBatch\ProductionBatchCancelled::class => [
            \App\Listeners\ProductionBatch\ClearProductionCache::class,
            \App\Listeners\ProductionBatch\LogProductionActivity::class,
        ],
        \App\Events\Recipe\RecipeCreated::class => [
            \App\Listeners\Recipe\ClearRecipeCache::class,
            \App\Listeners\Recipe\LogRecipeActivity::class,
        ],
        \App\Events\Recipe\RecipeUpdated::class => [
            \App\Listeners\Recipe\ClearRecipeCache::class,
            \App\Listeners\Recipe\LogRecipeActivity::class,
        ],
        \App\Events\Recipe\RecipeDeleted::class => [
            \App\Listeners\Recipe\ClearRecipeCache::class,
            \App\Listeners\Recipe\LogRecipeActivity::class,
        ],
        \App\Events\Recipe\RecipeRestored::class => [
            \App\Listeners\Recipe\ClearRecipeCache::class,
            \App\Listeners\Recipe\LogRecipeActivity::class,
        ],
        \App\Events\Recipe\InventoryConsumed::class => [
            \App\Listeners\Recipe\ClearRecipeCache::class,
            \App\Listeners\Recipe\LogRecipeActivity::class,
        ],
        \App\Events\Recipe\FoodCostUpdated::class => [
            \App\Listeners\Recipe\ClearRecipeCache::class,
            \App\Listeners\Recipe\LogRecipeActivity::class,
        ],
        \App\Events\Purchase\PurchaseRequestCreated::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\PurchaseRequestApproved::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\PurchaseRequestRejected::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\PurchaseRequestUpdated::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\PurchaseOrderCreated::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\PurchaseOrderApproved::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\GoodsReceiptCreated::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Purchase\GoodsReceiptRejected::class => [
            \App\Listeners\Purchase\ClearPurchaseCache::class,
            \App\Listeners\Purchase\LogPurchaseActivity::class,
        ],
        \App\Events\Supplier\SupplierCreated::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierUpdated::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierDeleted::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierRestored::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierStatusChanged::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierBlacklisted::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierPriceUpdated::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Supplier\SupplierDocumentUploaded::class => [
            \App\Listeners\Supplier\ClearSupplierCache::class,
            \App\Listeners\Supplier\LogSupplierActivity::class,
        ],
        \App\Events\Inventory\InventoryItemCreated::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\InventoryItemUpdated::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\InventoryBatchCreated::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\StockAdjusted::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\StockAudited::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\StockConsumed::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\LowStockTriggered::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Inventory\StockReceiptCompleted::class => [
            \App\Listeners\Inventory\ClearInventoryCache::class,
            \App\Listeners\Inventory\LogInventoryActivity::class,
        ],
        \App\Events\Expense\ExpenseCreated::class => [
            \App\Listeners\Expense\ClearExpenseCache::class,
            \App\Listeners\Expense\LogExpenseActivity::class,
        ],
        \App\Events\Expense\ExpenseUpdated::class => [
            \App\Listeners\Expense\ClearExpenseCache::class,
            \App\Listeners\Expense\LogExpenseActivity::class,
        ],
        \App\Events\Expense\ExpenseApproved::class => [
            \App\Listeners\Expense\ClearExpenseCache::class,
            \App\Listeners\Expense\LogExpenseActivity::class,
        ],
        \App\Events\Expense\ExpenseRejected::class => [
            \App\Listeners\Expense\ClearExpenseCache::class,
            \App\Listeners\Expense\LogExpenseActivity::class,
        ],

        // Finance Events
        \App\Events\Finance\ChartOfAccountCreated::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\ChartOfAccountUpdated::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\ChartOfAccountDeleted::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\JournalEntryCreated::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\JournalEntryUpdated::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\JournalEntryPosted::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\FinancialYearCreated::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\FinancialYearUpdated::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],
        \App\Events\Finance\FinancialYearClosed::class => [
            \App\Listeners\Finance\ClearFinanceCache::class,
            \App\Listeners\Finance\LogFinanceActivity::class,
        ],

        // Payment Events
        \App\Events\Payment\PaymentCreated::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\PaymentUpdated::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\PaymentSuccessful::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\PaymentFailed::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\WalletRecharged::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\RefundProcessed::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\WalletCreated::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],
        \App\Events\Payment\WalletUpdated::class => [
            \App\Listeners\Payment\ClearPaymentCache::class,
            \App\Listeners\Payment\LogPaymentActivity::class,
        ],

        // Notification Events
        \App\Events\Notification\NotificationCreated::class => [
            \App\Listeners\Notification\ClearNotificationCache::class,
            \App\Listeners\Notification\LogNotificationActivity::class,
        ],
        \App\Events\Notification\NotificationSent::class => [
            \App\Listeners\Notification\ClearNotificationCache::class,
            \App\Listeners\Notification\LogNotificationActivity::class,
        ],
        \App\Events\Notification\NotificationFailed::class => [
            \App\Listeners\Notification\ClearNotificationCache::class,
            \App\Listeners\Notification\LogNotificationActivity::class,
        ],
        \App\Events\Notification\NotificationRead::class => [
            \App\Listeners\Notification\ClearNotificationCache::class,
            \App\Listeners\Notification\LogNotificationActivity::class,
        ],
        \App\Events\Notification\TemplateCreated::class => [
            \App\Listeners\Notification\ClearNotificationCache::class,
            \App\Listeners\Notification\LogNotificationActivity::class,
        ],
        \App\Events\Notification\BroadcastCompleted::class => [
            \App\Listeners\Notification\ClearNotificationCache::class,
            \App\Listeners\Notification\LogNotificationActivity::class,
        ],

        // CMS & Settings Events
        \App\Events\SystemSetting\SystemSettingUpdated::class => [
            \App\Listeners\SystemSetting\ClearSystemSettingCache::class,
            \App\Listeners\SystemSetting\LogSystemSettingActivity::class,
        ],
        \App\Events\CmsPage\CmsPageCreated::class => [
            \App\Listeners\CmsPage\ClearCmsPageCache::class,
            \App\Listeners\CmsPage\LogCmsPageActivity::class,
        ],
        \App\Events\CmsPage\CmsPageUpdated::class => [
            \App\Listeners\CmsPage\ClearCmsPageCache::class,
            \App\Listeners\CmsPage\LogCmsPageActivity::class,
        ],
        \App\Events\CmsPage\CmsPagePublished::class => [
            \App\Listeners\CmsPage\ClearCmsPageCache::class,
            \App\Listeners\CmsPage\LogCmsPageActivity::class,
        ],
        \App\Events\CmsPage\CmsPageArchived::class => [
            \App\Listeners\CmsPage\ClearCmsPageCache::class,
            \App\Listeners\CmsPage\LogCmsPageActivity::class,
        ],
        \App\Events\CmsPage\CmsPageDeleted::class => [
            \App\Listeners\CmsPage\ClearCmsPageCache::class,
            \App\Listeners\CmsPage\LogCmsPageActivity::class,
        ],
        \App\Events\AppVersion\AppVersionCreated::class => [
            \App\Listeners\AppVersion\ClearAppVersionCache::class,
            \App\Listeners\AppVersion\LogAppVersionActivity::class,
        ],
        \App\Events\AppVersion\AppVersionUpdated::class => [
            \App\Listeners\AppVersion\ClearAppVersionCache::class,
            \App\Listeners\AppVersion\LogAppVersionActivity::class,
        ],
        \App\Events\AppVersion\AppVersionStatusChanged::class => [
            \App\Listeners\AppVersion\ClearAppVersionCache::class,
            \App\Listeners\AppVersion\LogAppVersionActivity::class,
        ],
        \App\Events\SystemBackup\BackupCreated::class => [
            \App\Listeners\SystemBackup\LogSystemBackupActivity::class,
        ],
        \App\Events\SystemBackup\BackupCompleted::class => [
            \App\Listeners\SystemBackup\LogSystemBackupActivity::class,
        ],
        \App\Events\SystemBackup\BackupFailed::class => [
            \App\Listeners\SystemBackup\LogSystemBackupActivity::class,
        ],
    ];
}
