export interface AdminUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  status: 'active' | 'inactive' | 'pending';
  profile_photo: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  last_login_device: string | null;
  last_login_browser: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  full_name: string;
}

export interface CreateAdminUser {
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string;
  password: string;
  password_confirmation: string;
  status?: string;
}

export type UpdateAdminUser = Partial<Omit<CreateAdminUser, 'password' | 'password_confirmation'>> & {
  password?: string;
  password_confirmation?: string;
};
