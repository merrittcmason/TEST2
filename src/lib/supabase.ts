import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const EXPECTED_SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';

if (typeof window !== 'undefined') {
  const storedKeys = Object.keys(localStorage).filter(key =>
    key.startsWith('sb-') && !key.includes(EXPECTED_SUPABASE_URL.replace('https://', '').replace('.supabase.co', ''))
  );

  if (storedKeys.length > 0) {
    console.log('Clearing old Supabase sessions from different instance');
    storedKeys.forEach(key => localStorage.removeItem(key));
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
