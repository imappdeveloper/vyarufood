export interface LoginHistory {
  id: number;
  uuid: string;
  admin?: {
    id: number;
    full_name: string;
    email: string;
  };
  ip_address: string;
  device?: string;
  browser?: string;
  os?: string;
  is_successful: boolean;
  failure_reason?: string;
  login_at?: string;
  logout_at?: string;
  created_at: string;
}
