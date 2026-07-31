<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CustomerAddress\StoreCustomerAddressRequest;
use App\Http\Requests\CustomerAddress\UpdateCustomerAddressRequest;
use App\Http\Resources\CustomerAddress\CustomerAddressResource;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Models\Master\Pincode;
use App\Models\Master\DeliveryZone;
use App\Enums\StatusEnum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerFrontAddressController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $addresses = CustomerAddress::where('customer_id', $customer->id)
            ->with(['country', 'state', 'city', 'area', 'pincode', 'deliveryZone'])
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->successResponse(
            CustomerAddressResource::collection($addresses),
            'Addresses retrieved successfully',
        );
    }

    public function store(StoreCustomerAddressRequest $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $data = $request->validated();
        $data['customer_id'] = $customer->id;
        $data['status'] = StatusEnum::Active;
        $data['is_verified'] = false;

        if (empty($data['delivery_zone_id'])) {
            $data['delivery_zone_id'] = $this->resolveDeliveryZone(
                $data['city_id'] ?? null,
                $data['area_id'] ?? null,
                $data['pincode_id'] ?? null,
            );
        }

        if (!empty($data['is_default']) && $data['is_default']) {
            CustomerAddress::where('customer_id', $customer->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        if (CustomerAddress::where('customer_id', $customer->id)->count() === 0) {
            $data['is_default'] = true;
        }

        $address = CustomerAddress::create($data);

        if (!empty($data['is_default'])) {
            $this->syncDefaultAddressToCustomerRecord($customer);
        }

        return $this->successResponse(
            new CustomerAddressResource($address->load(['country', 'state', 'city', 'area', 'pincode', 'deliveryZone'])),
            'Address created successfully',
            201,
        );
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $address = CustomerAddress::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->with(['country', 'state', 'city', 'area', 'pincode', 'deliveryZone'])
            ->first();

        if (!$address) {
            return $this->errorResponse('Address not found.', 404);
        }

        return $this->successResponse(new CustomerAddressResource($address));
    }

    public function update(UpdateCustomerAddressRequest $request, string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $address = CustomerAddress::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->first();

        if (!$address) {
            return $this->errorResponse('Address not found.', 404);
        }

        $data = $request->validated();

        if (!array_key_exists('delivery_zone_id', $data) || empty($data['delivery_zone_id'])) {
            $data['delivery_zone_id'] = $this->resolveDeliveryZone(
                $data['city_id'] ?? $address->city_id,
                $data['area_id'] ?? $address->area_id,
                $data['pincode_id'] ?? $address->pincode_id,
            );
        }

        if (!empty($data['is_default']) && $data['is_default']) {
            CustomerAddress::where('customer_id', $customer->id)
                ->where('is_default', true)
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($data);

        $isDefaultNow = $data['is_default'] ?? false;
        if ($isDefaultNow || $address->fresh()->is_default) {
            $this->syncDefaultAddressToCustomerRecord($customer);
        }

        return $this->successResponse(
            new CustomerAddressResource($address->fresh(['country', 'state', 'city', 'area', 'pincode', 'deliveryZone'])),
            'Address updated successfully',
        );
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $address = CustomerAddress::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->first();

        if (!$address) {
            return $this->errorResponse('Address not found.', 404);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $nextAddress = CustomerAddress::where('customer_id', $customer->id)
                ->where('status', StatusEnum::Active)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
            $this->syncDefaultAddressToCustomerRecord($customer);
        }

        return $this->successResponse(null, 'Address deleted successfully');
    }

    public function setDefault(Request $request, string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $address = CustomerAddress::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->first();

        if (!$address) {
            return $this->errorResponse('Address not found.', 404);
        }

        CustomerAddress::where('customer_id', $customer->id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        $address->update(['is_default' => true]);

        $this->syncDefaultAddressToCustomerRecord($customer);

        return $this->successResponse(
            new CustomerAddressResource($address->fresh(['country', 'state', 'city', 'area', 'pincode', 'deliveryZone'])),
            'Default address updated',
        );
    }

    public function getCountries(): JsonResponse
    {
        $countries = Country::where('status', StatusEnum::Active)->orderBy('name')->get();
        return $this->successResponse($countries);
    }

    public function getStates(string $countryUuid): JsonResponse
    {
        $country = Country::where('uuid', $countryUuid)->first();
        if (!$country) {
            return $this->errorResponse('Country not found.', 404);
        }
        $states = State::where('country_id', $country->id)
            ->where('status', StatusEnum::Active)
            ->orderBy('name')
            ->get();
        return $this->successResponse($states);
    }

    public function getCities(string $stateUuid): JsonResponse
    {
        $state = State::where('uuid', $stateUuid)->first();
        if (!$state) {
            return $this->errorResponse('State not found.', 404);
        }
        $cities = City::where('state_id', $state->id)
            ->where('status', StatusEnum::Active)
            ->orderBy('name')
            ->get();
        return $this->successResponse($cities);
    }

    public function getAreas(string $cityUuid): JsonResponse
    {
        $city = City::where('uuid', $cityUuid)->first();
        if (!$city) {
            return $this->errorResponse('City not found.', 404);
        }
        $areas = Area::where('city_id', $city->id)
            ->where('status', StatusEnum::Active)
            ->orderBy('name')
            ->get();
        return $this->successResponse($areas);
    }

    public function getPincodes(string $cityUuid): JsonResponse
    {
        $city = City::where('uuid', $cityUuid)->first();
        if (!$city) {
            return $this->errorResponse('City not found.', 404);
        }
        $pincodes = Pincode::where('city_id', $city->id)
            ->orderBy('pincode')
            ->get();
        return $this->successResponse($pincodes);
    }

    private function resolveDeliveryZone(?int $cityId, ?int $areaId, ?int $pincodeId): ?int
    {
        if ($pincodeId) {
            $pincode = Pincode::with('deliveryZone')->find($pincodeId);
            if ($pincode && $pincode->deliveryZone && $pincode->deliveryZone->status === StatusEnum::Active) {
                return $pincode->deliveryZone->id;
            }
        }

        if ($areaId) {
            $zone = DeliveryZone::where('area_id', $areaId)
                ->where('status', StatusEnum::Active)
                ->first();
            if ($zone) {
                return $zone->id;
            }
        }

        if ($cityId) {
            $zone = DeliveryZone::where('city_id', $cityId)
                ->where('status', StatusEnum::Active)
                ->orderBy('priority')
                ->first();
            if ($zone) {
                return $zone->id;
            }
        }

        return null;
    }

    private function syncDefaultAddressToCustomerRecord(Customer $customer): void
    {
        $defaultAddress = CustomerAddress::where('customer_id', $customer->id)
            ->where('is_default', true)
            ->first();

        if (!$defaultAddress) {
            $customer->update([
                'address_line_1' => null,
                'address_line_2' => null,
                'country_id' => null,
                'state_id' => null,
                'city_id' => null,
                'area_id' => null,
                'pincode' => null,
                'latitude' => null,
                'longitude' => null,
            ]);
            return;
        }

        $pincodeValue = null;
        if ($defaultAddress->pincode_id) {
            $pincodeRecord = Pincode::find($defaultAddress->pincode_id);
            $pincodeValue = $pincodeRecord ? $pincodeRecord->pincode : null;
        }

        $customer->update([
            'address_line_1' => $defaultAddress->address_line_1,
            'address_line_2' => $defaultAddress->address_line_2,
            'country_id' => $defaultAddress->country_id,
            'state_id' => $defaultAddress->state_id,
            'city_id' => $defaultAddress->city_id,
            'area_id' => $defaultAddress->area_id,
            'pincode' => $pincodeValue,
            'latitude' => $defaultAddress->latitude,
            'longitude' => $defaultAddress->longitude,
        ]);
    }
}
