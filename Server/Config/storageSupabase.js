import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE env for storage client");
}

/**
 * 🔒 STORAGE-ONLY CLIENT
 * - Uses SERVICE ROLE
 * - NO auth state
 * - IMMUNE to logout
 */
const storageSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

/* 🔎 One-time sanity check */
(async () => {
  const { data, error } = await storageSupabase
    .storage
    .from("videos")
    .list("", { limit: 1 });

  console.log("🎬 STORAGE CLIENT CHECK", {
    ok: !error,
    error: error?.message,
  });
})();

export default storageSupabase;
