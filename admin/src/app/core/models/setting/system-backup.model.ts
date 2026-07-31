export interface SystemBackup {
  id: number;
  uuid: string;
  backup_name: string;
  backup_type: 'database' | 'storage' | 'full';
  backup_type_label: string;
  file_path: string;
  file_size: number;
  file_size_formatted: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  status_label: string;
  started_at: string | null;
  completed_at: string | null;
  duration: string | null;
  error_message: string | null;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
}

export interface CreateBackup {
  backup_name: string;
  backup_type: string;
}

export interface BackupStats {
  status_counts: Record<string, number>;
  type_counts: Record<string, number>;
  total_size: number;
}

export const BACKUP_TYPES: string[] = ['database', 'storage', 'full'];
