<?php
declare(strict_types=1);
namespace App\Imports;
use App\Models\Master\City;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Str;

class CityImport implements ToModel, WithHeadingRow
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

    public function model(array $row): ?City
    {
        try {
            $countryId = (int) ($row['country_id'] ?? 0);
            $stateId = (int) ($row['state_id'] ?? 0);
            $name = trim($row['name'] ?? '');
            $cityCode = trim($row['city_code'] ?? '');

            if (empty($name) || $countryId === 0 || $stateId === 0 || empty($cityCode)) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: Missing required fields (name, country_id, state_id, city_code)";
                return null;
            }

            if (City::where('name', $name)->where('state_id', $stateId)->exists()) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: City '{$name}' already exists in this state";
                return null;
            }

            if (City::where('city_code', $cityCode)->exists()) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: City code '{$cityCode}' already exists";
                return null;
            }

            $this->successCount++;
            return new City([
                'uuid' => Str::uuid()->toString(),
                'country_id' => $countryId,
                'state_id' => $stateId,
                'name' => $name,
                'city_code' => $cityCode,
                'latitude' => $row['latitude'] ?? null,
                'longitude' => $row['longitude'] ?? null,
                'timezone' => $row['timezone'] ?? null,
                'population' => isset($row['population']) ? (int) $row['population'] : null,
                'display_order' => (int) ($row['display_order'] ?? 0),
                'is_metro' => strtolower($row['is_metro'] ?? 'no') === 'yes',
                'status' => $row['status'] ?? 'active',
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
