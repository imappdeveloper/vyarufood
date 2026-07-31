export interface CustomerProfile {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  country_code: string;
  gender: string | null;
  date_of_birth: string | null;
  profile_photo: string | null;
  status: 'active' | 'inactive' | 'blocked';
  wallet_balance: number;
  referral_code: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}
