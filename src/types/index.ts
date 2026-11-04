export interface Profile {
  id: string;
  full_name: string;
  university_name: string;
  department?: string;
  student_id?: string;
  is_verified: boolean;
  verification_method?: 'edu_email' | 'id_card';
  id_card_url?: string;
  gender?: 'male' | 'female' | 'other';
  phone_number?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Tour {
  id: string;
  creator_id: string;
  title: string;
  destination: string;
  departure_date: string;
  return_date: string;
  estimated_budget_bdt: number;
  max_members: number;
  gender_preference: 'any' | 'male_only' | 'female_only';
  description: string;
  whatsapp_group_link?: string;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  created_at: string;
  profiles?: Profile;
}

export interface TourRequest {
  id: string;
  tour_id: string;
  applicant_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  profiles?: Profile;
  tours?: Tour;
}
