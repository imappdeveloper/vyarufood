import { CustomerProfile } from '../models/customer/customer-profile.model';

export interface CustomerGoogleAuthResponse {
  customer: CustomerProfile;
  token?: string;
  abilities?: string[];
  is_new: boolean;
}
