import { supabase } from '../lib/supabase';
import type { Event, Profile, TokenUsage, UploadQuota } from '../types/database.types';

export class DatabaseService {
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getEvents(userId: string, startDate?: string, endDate?: string): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true });

    if (startDate) {
      query = query.gte('event_date', startDate);
    }
    if (endDate) {
      query = query.lte('event_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createEvent(userId: string, event: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert({ ...event, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createEvents(userId: string, events: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]): Promise<Event[]> {
    const eventsWithUser = events.map(event => ({ ...event, user_id: userId }));
    const { data, error } = await supabase
      .from('events')
      .insert(eventsWithUser)
      .select();

    if (error) throw error;
    return data;
  }

  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  }

  static async getTokenUsage(userId: string): Promise<TokenUsage | null> {
    const { data, error } = await supabase
      .from('token_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async updateTokenUsage(userId: string, tokensConsumed: number): Promise<TokenUsage> {
    const current = await this.getTokenUsage(userId);
    const newUsed = (current?.tokens_used || 0) + tokensConsumed;

    const { data, error } = await supabase
      .from('token_usage')
      .update({ tokens_used: newUsed })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUploadQuota(userId: string): Promise<UploadQuota | null> {
    const { data, error } = await supabase
      .from('upload_quotas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async incrementUploadUsage(userId: string): Promise<UploadQuota> {
    const current = await this.getUploadQuota(userId);
    const newUsed = (current?.uploads_used || 0) + 1;

    const { data, error } = await supabase
      .from('upload_quotas')
      .update({ uploads_used: newUsed })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
