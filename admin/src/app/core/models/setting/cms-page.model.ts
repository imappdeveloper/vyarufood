export interface CmsPage {
  id: number;
  uuid: string;
  page_code: string;
  page_title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: 'draft' | 'published' | 'archived';
  status_label: string;
  published_at: string | null;
  created_by: number | null;
  created_by_name: string | null;
  updated_by: number | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCmsPage {
  page_code: string;
  page_title: string;
  slug: string;
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  status?: string;
}

export type UpdateCmsPage = Partial<CreateCmsPage>;

export interface CmsPageStats {
  status_counts: Record<string, number>;
  total: number;
}
