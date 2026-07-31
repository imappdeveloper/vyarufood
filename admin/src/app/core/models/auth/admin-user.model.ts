export interface AdminUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  mobile?: string;
  profile_photo?: string;
  status: string;
  status_label: string;
  last_login_at?: string;
  last_login_ip?: string;
  email_verified_at?: string;
  roles?: RoleRef[];
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface RoleRef {
  id: number;
  name: string;
  display_name: string;
}

export interface CreateAdminUser {
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string;
  password: string;
  password_confirmation: string;
  role_id: number;
  status?: string;
}

export interface UpdateAdminUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  role_id?: number;
  status?: string;
}
