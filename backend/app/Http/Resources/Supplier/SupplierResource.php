<?php

declare(strict_types=1);

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'supplier_code' => $this->supplier_code,
            'supplier_name' => $this->supplier_name,
            'supplier_type' => $this->supplier_type,
            'company_name' => $this->company_name,
            'contact_person' => $this->contact_person,
            'email' => $this->email,
            'mobile' => $this->mobile,
            'alternate_mobile' => $this->alternate_mobile,
            'phone' => $this->phone,
            'website' => $this->website,
            'gst_number' => $this->gst_number,
            'pan_number' => $this->pan_number,
            'fssai_license' => $this->fssai_license,
            'drug_license' => $this->drug_license,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'country_id' => $this->country_id,
            'country_name' => $this->whenLoaded('country', fn () => $this->getRelation('country')?->name),
            'state_id' => $this->state_id,
            'state_name' => $this->whenLoaded('state', fn () => $this->getRelation('state')?->name),
            'city_id' => $this->city_id,
            'city_name' => $this->whenLoaded('city', fn () => $this->getRelation('city')?->name),
            'city' => $this->city,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'bank_name' => $this->bank_name,
            'account_holder_name' => $this->account_holder_name,
            'account_number' => $this->account_number,
            'ifsc_code' => $this->ifsc_code,
            'branch_name' => $this->branch_name,
            'credit_limit' => $this->credit_limit,
            'credit_days' => $this->credit_days,
            'payment_terms' => $this->payment_terms,
            'opening_balance' => $this->opening_balance,
            'current_balance' => $this->current_balance,
            'outstanding_balance' => $this->outstanding_balance,
            'rating' => $this->rating,
            'status' => $this->status,
            'status_label' => ucfirst($this->status ?? ''),
            'is_preferred' => $this->is_preferred,
            'remarks' => $this->remarks,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->getRelation('createdBy')?->name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->getRelation('updatedBy')?->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'products_count' => $this->whenCounted('products'),
            'documents_count' => $this->whenCounted('documents'),
            'contacts_count' => $this->whenCounted('contacts'),
            'products' => SupplierProductResource::collection($this->whenLoaded('products')),
            'documents' => SupplierDocumentResource::collection($this->whenLoaded('documents')),
            'contacts' => SupplierContactResource::collection($this->whenLoaded('contacts')),
        ];
    }
}
