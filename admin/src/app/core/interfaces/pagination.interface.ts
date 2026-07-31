export interface PaginationParams {
  page: number;
  per_page: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
