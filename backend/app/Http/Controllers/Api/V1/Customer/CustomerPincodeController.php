<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Models\Pincode;
use App\Models\PincodeRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerPincodeController extends BaseController
{
    public function checkPincode(string $pincode): JsonResponse
    {
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
            'pincode' => $pincode,
            'message' => 'Great! We deliver to your area.',
            'zone_name' => $zone?->zone_name,
            'estimated_delivery_time' => $zone?->estimated_delivery_time ?? 30,
            'delivery_charge' => (float) ($zone?->delivery_charge ?? 0),
            'free_delivery_above' => (float) ($zone?->free_delivery_above ?? 0),
            'minimum_order_amount' => (float) ($zone?->minimum_order_amount ?? 0),
            'city' => $pincodeRecord->office_name ?? $pincodeRecord->district,
        ], 'Pincode check completed');
    }

    public function requestService(Request $request): JsonResponse
    {
        $request->validate([
            'pincode' => 'required|string|max:10',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'nullable|string|max:500',
        ]);

        $existing = PincodeRequest::where('pincode', $request->pincode)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return $this->successResponse(null, 'We already have a request for this pincode. We will notify you when service is available.');
        }

        $pincodeRequest = PincodeRequest::create([
            'customer_id' => $request->user()?->id,
            'pincode' => $request->pincode,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        return $this->successResponse($pincodeRequest, 'Thank you! We have received your service request. We will notify you when we start serving your area.');
    }
}
