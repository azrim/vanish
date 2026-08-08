// Shared Supabase client for CF Pages Functions
import { createClient } from '@supabase/supabase-js';

const url = 'https://fxmmiieaoajwpribvhfz.supabase.co';
const key = 'sb_publishable_HkqeNFSWDZoA1Rc2YuhG0g_MukfccdV';

export function getSupabase() {
  return createClient(url, key);
}
