<?php
declare(strict_types=1);
namespace App\Imports;
use App\Models\Master\State;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Str;

class StateImport implements ToModel, WithHeadingRow
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

    public function model(array $row): ?State
    {
        try {
            $countryId = (int) ($row['country_id'] ?? 0);
            $name = trim($row['name'] ?? '');

            if (empty($name) || $countryId === 0) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: Missing required fields (name, country_id)";
                return null;
            }

            if (State::where('name', $name)->where('country_id', $countryId)->exists()) {
                $this->errorCount++;
                $this->errors[] = "Row {$this->successCount + $this->errorCount}: State '{$name}' already exists for this country";
                return null;
            }

            $this->successCount++;
            return new State([
                'uuid' => Str::uuid()->toString(),
                'country_id' => $countryId,
                'name' => $name,
                'state_code' => $row['state_code'] ?? null,
                'abbreviation' => $row['abbreviation'] ?? null,
                'gst_code' => $row['gst_code'] ?? null,
                'latitude' => $row['latitude'] ?? null,
                'longitude' => $row['longitude'] ?? null,
                'status' => $row['status'] ?? 'active',
                'sort_order' => (int) ($row['sort_order'] ?? 0),
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
