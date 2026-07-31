<?php
declare(strict_types=1);
namespace App\Imports;
use App\Models\Master\Country;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Str;

class CountryImport implements ToModel, WithHeadingRow
{
    use Importable;

    public int $successCount = 0;
    public int $errorCount = 0;
    public array $errors = [];
    protected int $createdBy;

    public function __construct(int $createdBy)
    {
        $this->createdBy = $createdBy;
    }

    public function model(array $row): ?Country
    {
        try {
            $iso2 = strtoupper(trim($row['iso2'] ?? $row['iso_2'] ?? ''));
            $iso3 = strtoupper(trim($row['iso3'] ?? $row['iso_3'] ?? ''));
            $name = trim($row['name'] ?? '');

            if (empty($iso2) || empty($iso3) || empty($name)) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: Missing required fields (name, iso2, iso3)";
                return null;
            }

            if (Country::where('name', $name)->exists() || Country::where('iso2', $iso2)->exists()) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: Country with name '{$name}' or ISO2 '{$iso2}' already exists";
                return null;
            }

            $this->successCount++;
            return new Country([
                'uuid' => Str::uuid()->toString(),
                'iso2' => $iso2,
                'iso3' => $iso3,
                'name' => $name,
                'numeric_code' => $row['numeric_code'] ?? null,
                'phone_code' => $row['phone_code'] ?? null,
                'native_name' => $row['native_name'] ?? null,
                'capital' => $row['capital'] ?? null,
                'currency_code' => $row['currency_code'] ?? null,
                'currency_symbol' => $row['currency_symbol'] ?? null,
                'currency_name' => $row['currency_name'] ?? null,
                'region' => $row['region'] ?? null,
                'subregion' => $row['subregion'] ?? null,
                'nationality' => $row['nationality'] ?? null,
                'status' => $row['status'] ?? 'active',
                'sort_order' => (int) ($row['sort_order'] ?? 0),
                'is_default' => strtolower($row['is_default'] ?? 'no') === 'yes',
                'created_by' => $this->createdBy,
                'updated_by' => $this->createdBy,
            ]);
        } catch (\Exception $e) {
            $this->errorCount++;
            $this->errors[] = "Row {$this->successCount + $this->errorCount}: " . $e->getMessage();
            return null;
        }
    }

    public function getResult(): array
    {
        return [
            'success_count' => $this->successCount,
            'error_count' => $this->errorCount,
            'errors' => $this->errors,
        ];
    }
}
