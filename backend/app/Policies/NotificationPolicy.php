<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Notification;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Gate;

class NotificationPolicy
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

    public function view(Admin $user, Notification $notification): bool
    {
        return true;
    }

    public function create(Admin $user): bool
    {
        return true;
    }

    public function send(Admin $user, Notification $notification): bool
    {
        return true;
    }

    public function broadcast(Admin $user, Notification $notification): bool
    {
        return true;
    }

    public function update(Admin $user, Notification $notification): bool
    {
        return false;
    }

    public function delete(Admin $user, Notification $notification): bool
    {
        return false;
    }
}
