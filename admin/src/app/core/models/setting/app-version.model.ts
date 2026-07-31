export interface AppVersion {
  id: number;
  uuid: string;
  platform: 'android' | 'ios' | 'web';
  version_name: string;
  version_code: number;
  minimum_supported_version: string | null;
  force_update: boolean;
  release_notes: string | null;
  status: 'active' | 'inactive' | 'deprecated';
  status_label: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppVersion {
  platform: string;
  version_name: string;
  version_code: number;
  minimum_supported_version?: string | null;
  force_update?: boolean;
  release_notes?: string | null;
  status?: string;
}

export type UpdateAppVersion = Partial<CreateAppVersion>;

export interface OutdatedCheck {
  is_outdated: boolean;
  latest_version: AppVersion | null;
  force_update: boolean;
}

export const PLATFORMS: string[] = ['android', 'ios', 'web'];
export const VERSION_STATUSES: string[] = ['active', 'inactive', 'deprecated'];
