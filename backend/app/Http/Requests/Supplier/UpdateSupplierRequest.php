<?php

declare(strict_types=1);

namespace App\Http\Requests\Supplier;

use App\Support\BaseRequest;

class UpdateSupplierRequest extends BaseRequest
{
    public function rules(): array
    {
        $supplierUuid = $this->route('uuid');

        return [
            'supplier_name' => ['nullable', 'string', 'max:200'],
            'supplier_type' => ['nullable', 'string', 'in:raw_material,packaging,gas,cleaning,equipment,general'],
            'company_name' => ['required', 'string', 'max:200'],
            'contact_person' => ['nullable', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'mobile' => ['nullable', 'string', 'max:20'],
            'alternate_mobile' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'string', 'max:255'],
            'gst_number' => ['nullable', 'string', 'max:20', 'unique:suppliers,gst_number,' . $supplierUuid . ',uuid'],
            'pan_number' => ['nullable', 'string', 'max:20', 'unique:suppliers,pan_number,' . $supplierUuid . ',uuid'],
            'fssai_license' => ['nullable', 'string', 'max:50'],
            'drug_license' => ['nullable', 'string', 'max:50'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'pincode' => ['nullable', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'bank_name' => ['nullable', 'string', 'max:150'],
            'account_holder_name' => ['nullable', 'string', 'max:150'],
            'account_number' => ['nullable', 'string', 'max:30'],
            'ifsc_code' => ['nullable', 'string', 'max:15'],
            'branch_name' => ['nullable', 'string', 'max:150'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'credit_days' => ['nullable', 'numeric', 'min:0'],
            'payment_terms' => ['nullable', 'string', 'max:100'],
            'opening_balance' => ['nullable', 'numeric'],
            'current_balance' => ['nullable', 'numeric'],
            'rating' => ['nullable', 'integer', 'min:0', 'max:5'],
            'status' => ['nullable', 'string', 'in:active,inactive,blocked'],
            'is_preferred' => ['nullable', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'supplier_name' => 'Supplier Name',
            'supplier_type' => 'Supplier Type',
            'company_name' => 'Company Name',
            'contact_person' => 'Contact Person',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'alternate_mobile' => 'Alternate Mobile',
            'phone' => 'Phone',
            'website' => 'Website',
            'gst_number' => 'GST Number',
            'pan_number' => 'PAN Number',
            'fssai_license' => 'FSSAI License',
            'drug_license' => 'Drug License',
            'address_line_1' => 'Address Line 1',
            'address_line_2' => 'Address Line 2',
            'country_id' => 'Country',
            'state_id' => 'State',
            'city_id' => 'City',
            'city' => 'City Name',
            'state' => 'State Name',
            'pincode' => 'Pincode',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
            'bank_name' => 'Bank Name',
            'account_holder_name' => 'Account Holder Name',
            'account_number' => 'Account Number',
            'ifsc_code' => 'IFSC Code',
            'branch_name' => 'Branch Name',
            'credit_limit' => 'Credit Limit',
            'credit_days' => 'Credit Days',
            'payment_terms' => 'Payment Terms',
            'opening_balance' => 'Opening Balance',
            'current_balance' => 'Current Balance',
            'rating' => 'Rating',
            'status' => 'Status',
            'is_preferred' => 'Preferred Supplier',
            'remarks' => 'Remarks',
        ];
    }
}
