export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'status' | 'image' | 'date';
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: string;
  condition?: (row: any) => boolean;
  callback: (row: any) => void;
}
