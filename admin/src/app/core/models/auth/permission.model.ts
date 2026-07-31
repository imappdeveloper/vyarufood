export interface Permission {
  id: number;
  name: string;
  display_name?: string;
  group?: string;
  guard_name: string;
  created_at: string;
}

export interface PermissionGroup {
  group: string;
  permissions: Permission[];
}
