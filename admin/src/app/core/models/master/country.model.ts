export interface Country {
  id: number;
  uuid: string;
  iso2: string;
  iso3: string;
  numeric_code: string | null;
  phone_code: string | null;
  name: string;
  native_name: string | null;
  capital: string | null;
  currency_code: string | null;
  currency_symbol: string | null;
  currency_name: string | null;
  emoji: string | null;
  emoji_unicode: string | null;
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  subregion: string | null;
  nationality: string | null;
  flag_image: string | null;
  status: 'active' | 'inactive' | 'pending';
  sort_order: number;
  is_default: boolean;
  remarks: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCountry {
  iso2: string;
  iso3: string;
  name: string;
  numeric_code?: string;
  phone_code?: string;
  native_name?: string;
  capital?: string;
  currency_code?: string;
  currency_symbol?: string;
  currency_name?: string;
  emoji?: string;
  emoji_unicode?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  subregion?: string;
  nationality?: string;
  flag_image?: string;
  status?: string;
  sort_order?: number;
  is_default?: boolean;
  remarks?: string;
}

export type UpdateCountry = Partial<CreateCountry>;

export interface CountryImportResult {
  success_count: number;
  error_count: number;
  errors: string[];
}
