import { createClient } from '@supabase/supabase-js';

// These will come from environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export type Tables = {
  beers: {
    id: string;
    created_at: string;
    user_id: string;
    brand_name: string;
    product_name: string;
    type: string | null;
    expiry_date: string;
    reminder_date: string;
    image_url: string | null;
    reminder_sent: boolean;
    reminder_count: number;
  };
  profiles: {
    id: string;
    created_at: string;
    username: string;
    email: string;
    device_token: string | null;
  };
}; 