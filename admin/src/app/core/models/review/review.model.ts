export interface Review {
  id: number;
  uuid: string;
  customer_id: number;
  meal_id: number;
  order_id: number | null;
  rating: number;
  title: string | null;
  comment: string | null;
  photo: string | null;
  status: 'approved' | 'pending' | 'rejected' | 'hidden';
  status_label: string;
  is_verified_purchase: boolean;
  admin_response: string | null;
  admin_responded_at: string | null;
  rejection_reason?: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  customer?: ReviewCustomer;
  meal?: ReviewMeal;
  order_info?: ReviewOrderInfo;
}

export interface ReviewCustomer {
  id: number;
  full_name: string | null;
  email: string;
  avatar: string | null;
}

export interface ReviewMeal {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  meal_image: string | null;
}

export interface ReviewOrderInfo {
  id: number;
  order_number: string;
  order_number_display: string;
}

export interface ReviewRatingDistribution {
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  distribution: Record<number, ReviewRatingDistribution>;
}

export interface ReviewEligibility {
  can_review: boolean;
  has_ordered: boolean;
  has_reviewed: boolean;
  existing_review: Review | null;
  order_id: number | null;
}

export interface ReviewEligibilityByOrder {
  eligible: boolean;
  reason?: string;
  order_uuid?: string;
  order_number_display?: string;
  order_status?: string;
  items?: ReviewEligibilityOrderItem[];
}

export interface ReviewEligibilityOrderItem {
  meal_id: number;
  meal_name: string;
  meal_image: string | null;
  meal_slug: string | null;
  can_review: boolean;
  review_uuid: string | null;
  existing_review: {
    uuid: string;
    rating: number;
    title: string | null;
    comment: string | null;
    photo: string | null;
    status: string;
    created_at: string;
  } | null;
}

export interface ReviewListResponse {
  success: boolean;
  message?: string;
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ReviewListParams {
  page?: number;
  per_page?: number;
  rating?: number;
  with_photo?: boolean;
  status?: string;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'with_photos';
}

export interface CreateReviewPayload {
  meal_id: number;
  order_id?: number | null;
  rating: number;
  title?: string;
  comment?: string;
  photo?: File | null;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
  photo?: File | null;
}

export type ReviewFilterType = 'all' | 'with_photo' | 'verified' | number;

export const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};
