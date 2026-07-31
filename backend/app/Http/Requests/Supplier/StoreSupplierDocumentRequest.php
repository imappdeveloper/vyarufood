<?php

declare(strict_types=1);

namespace App\Http\Requests\Supplier;

use App\Support\BaseRequest;

class StoreSupplierDocumentRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'document_type' => ['required', 'string', 'in:gst_certificate,pan_card,fssai_license,drug_license,insurance,agreement,quality_certificate,other'],
            'document_name' => ['required', 'string', 'max:200'],
            'document_path' => ['required', 'string', 'max:500'],
            'expiry_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:active,expired,revoked'],
        ];
    }

    public function attributes(): array
    {
        return [
            'document_type' => 'Document Type',
            'document_name' => 'Document Name',
            'document_path' => 'Document Path',
            'expiry_date' => 'Expiry Date',
            'status' => 'Status',
        ];
    }
}
