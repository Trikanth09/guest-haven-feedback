
export interface FeedbackRatings {
  cleanliness: number;
  staff: number;
  comfort: number;
  amenities: number;
  value: number;
  food?: number;
  location?: number;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  hotel_id?: string | null;
  room_number?: string | null;
  stay_date?: string | null;
  ratings: FeedbackRatings;
  comments: string;
  created_at: string;
  status?: string;
  user_id?: string | null;
}

export type FeedbackStatus = 'new' | 'in-progress' | 'resolved';

export interface FeedbackFilterOptions {
  search?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  status?: string;
  minRating?: number;
  maxRating?: number;
}
