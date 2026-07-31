<?php

declare(strict_types=1);

namespace App\Support;

use App\Traits\ApiResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as IlluminateController;

abstract class BaseController extends IlluminateController
{
    use ApiResponse, AuthorizesRequests, ValidatesRequests;
}
