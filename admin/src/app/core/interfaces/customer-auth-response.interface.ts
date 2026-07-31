import { CustomerProfile } from '../models/customer/customer-profile.model';

export interface CustomerAuthResponse {
  customer: CustomerProfile;
  token?: string;
  abilities?: string[];
}
