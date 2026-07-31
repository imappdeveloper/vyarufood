<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

trait ApiResponse
{
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    protected function createdResponse(
        mixed $data = null,
        string $message = 'Created successfully',
    ): JsonResponse {
        return $this->successResponse($data, $message, 201);
    }

    protected function noContentResponse(
        string $message = 'Deleted successfully',
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => null,
        ], 200);
    }

    protected function errorResponse(
        string $message = 'Error occurred',
        int $statusCode = 400,
        mixed $errors = null,
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    protected function validationErrorResponse(
        mixed $errors,
        string $message = 'Validation failed',
    ): JsonResponse {
        return $this->errorResponse($message, 422, $errors);
    }

    protected function unauthorizedResponse(
        string $message = 'Unauthorized',
    ): JsonResponse {
        return $this->errorResponse($message, 401);
    }

    protected function forbiddenResponse(
        string $message = 'Forbidden',
    ): JsonResponse {
        return $this->errorResponse($message, 403);
    }

    protected function notFoundResponse(
        string $message = 'Resource not found',
    ): JsonResponse {
        return $this->errorResponse($message, 404);
    }

    protected function serverErrorResponse(
        string $message = 'Internal server error',
    ): JsonResponse {
        return $this->errorResponse($message, 500);
    }

    protected function paginatedResponse(
        ResourceCollection $collection,
        string $message = 'Success',
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $collection->response()->getData(true)['data'],
            'meta' => [
                'current_page' => $collection->response()->getData(true)['meta']['current_page'] ?? 1,
                'last_page' => $collection->response()->getData(true)['meta']['last_page'] ?? 1,
                'per_page' => $collection->response()->getData(true)['meta']['per_page'] ?? 15,
                'total' => $collection->response()->getData(true)['meta']['total'] ?? 0,
            ],
            'links' => $collection->response()->getData(true)['links'] ?? [],
        ]);
    }

    protected function bulkResponse(
        mixed $data = null,
        string $message = 'Bulk operation completed',
        int $affected = 0,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'affected' => $affected,
        ], 200);
    }

    protected function fileUploadResponse(
        string $url,
        string $name,
        string $disk = 'public',
    ): JsonResponse {
        return $this->createdResponse([
            'url' => $url,
            'name' => $name,
            'disk' => $disk,
        ], 'File uploaded successfully');
    }
}
