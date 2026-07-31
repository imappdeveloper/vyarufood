export interface Role {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  guard_name: string;
  is_default: boolean;
  sort_order: number;
  admins_count?: number;
  permissions?: PermissionRef[];
  created_at: string;
  updated_at: string;
}

export interface PermissionRef {
  id: number;
  name: string;
  display_name?: string;
  group?: string;
}

export interface CreateRole {
  name: string;
  display_name?: string;
  description?: string;
  permission_ids?: number[];
  is_default?: boolean;
}

export interface UpdateRole {
  name?: string;
  display_name?: string;
  description?: string;
  permission_ids?: number[];
}
