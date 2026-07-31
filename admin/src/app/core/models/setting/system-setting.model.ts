export interface SystemSetting {
  id: number;
  uuid: string;
  setting_group: string;
  setting_key: string;
  setting_value: any;
  raw_value: string | null;
  data_type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'text';
  is_encrypted: boolean;
  autoload: boolean;
  status: 'active' | 'inactive';
  remarks: string | null;
  updated_by: number | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSystemSetting {
  setting_group: string;
  setting_key: string;
  setting_value: string | null;
  data_type?: string;
  is_encrypted?: boolean;
  autoload?: boolean;
  status?: string;
  remarks?: string;
}

export type UpdateSystemSetting = Partial<CreateSystemSetting>;

export interface SettingGroupStats {
  groups: Record<string, number>;
  status_counts: Record<string, number>;
}

export const SETTING_GROUPS: string[] = [
  'general', 'company', 'branding', 'localization', 'email', 'sms',
  'firebase', 'payment_gateway', 'tax', 'subscription', 'kitchen',
  'delivery', 'order', 'wallet', 'security', 'seo', 'api',
  'maintenance', 'backup', 'logging',
];

export const DATA_TYPES: string[] = [
  'string', 'integer', 'float', 'boolean', 'json', 'text',
];
