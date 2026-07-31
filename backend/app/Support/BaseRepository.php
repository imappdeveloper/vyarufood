<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    protected Model $model;

    abstract protected function model(): Model;

    public function __construct()
    {
        $this->model = $this->model();
    }

    public function newQuery(): Builder
    {
        return $this->model->newQuery();
    }

    public function get(array $columns = ['*']): Builder
    {
        return $this->model->query()->select($columns);
    }

    public function where(string $column, mixed $value): Builder
    {
        return $this->model->where($column, $value);
    }

    public function firstOrCreate(array $data, array $attributes = []): Model
    {
        return $this->model->firstOrCreate($data, $attributes);
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function exists(): bool
    {
        return $this->model->exists();
    }

    public function chunk(int $count, callable $callback): bool
    {
        return $this->model->chunk($count, $callback);
    }
}
