// Utils/supabaseServiceClient.js
import { createClient } from "@supabase/supabase-js";

export function createServiceSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
