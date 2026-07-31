<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class UploadManager
{
    protected array $diskConfig = [];

    public function __construct()
    {
        $this->diskConfig = [
            'images' => config('storage.disks.images', 'public'),
            'documents' => config('storage.disks.documents', 'private'),
            'temp' => config('storage.disks.temp', 'local'),
        ];
    }

    public function uploadImage(
        UploadedFile $file,
        string $folder = 'images',
        ?int $maxWidth = 1200,
        ?int $maxHeight = 1200,
        int $quality = 85,
    ): array {
        $disk = $this->diskConfig['images'] ?? 'public';
        $filename = $this->generateFilename($file, $folder);
        $path = $folder . '/' . $filename;

        $image = Image::make($file);
        $image->resize($maxWidth, $maxHeight, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        })->encode('webp', $quality);

        Storage::disk($disk)->put($path, $image->getEncoded());

        return [
            'path' => $path,
            'url' => Storage::disk($disk)->url($path),
            'disk' => $disk,
            'mime_type' => 'image/webp',
            'size' => Storage::disk($disk)->size($path),
        ];
    }

    public function uploadFile(
        UploadedFile $file,
        string $folder = 'documents',
        ?string $disk = null,
    ): array {
        $disk = $disk ?? $this->diskConfig['documents'] ?? 'private';
        $filename = $this->generateFilename($file, $folder);
        $path = $folder . '/' . $filename;

        Storage::disk($disk)->put($path, file_get_contents($file->getRealPath()));

        return [
            'path' => $path,
            'url' => Storage::disk($disk)->url($path),
            'disk' => $disk,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'original_name' => $file->getClientOriginalName(),
        ];
    }

    public function deleteFile(string $path, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }
        return false;
    }

    protected function generateFilename(UploadedFile $file, string $folder): string
    {
        $timestamp = now()->format('Y/m');
        $hash = md5($file->getClientOriginalName() . microtime(true));
        $extension = 'webp';

        return "{$timestamp}/{$hash}.{$extension}";
    }
}
