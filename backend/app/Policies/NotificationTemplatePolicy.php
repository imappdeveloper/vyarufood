<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\NotificationTemplate;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotificationTemplatePolicy
{
    use HandlesAuthorization;

    public function before(Admin $user, string $ability): ?bool
    {
        if ($user instanceof Admin && $user->can('access_admin_panel')) {
            return true;
        }

        return null;
    }

    public function viewAny(Admin $user): bool
    {
        return true;
    }

    public function view(Admin $user, NotificationTemplate $notificationTemplate): bool
    {
        return true;
    }

    public function create(Admin $user): bool
    {
        return true;
    }

    public function update(Admin $user, NotificationTemplate $notificationTemplate): bool
    {
        return true;
    }

    public function delete(Admin $user, NotificationTemplate $notificationTemplate): bool
    {
        return true;
    }
}
