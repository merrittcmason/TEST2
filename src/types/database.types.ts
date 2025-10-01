export interface Profile {
  id: string;
  display_name: string;
  theme_preference: 'dark' | 'light';
  subscription_tier: 'free' | 'student' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  event_name: string;
  event_date: string;
  event_time: string | null;
  event_tag: string;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'student' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface TokenUsage {
  id: string;
  user_id: string;
  tokens_used: number;
  tokens_limit: number;
  reset_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadQuota {
  id: string;
  user_id: string;
  uploads_used: number;
  uploads_limit: number;
  reset_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParsedEvent {
  event_name: string;
  event_date: string;
  event_time?: string;
  event_tag?: string;
  is_all_day: boolean;
}
