import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log("🔐 SUPABASE ENV CHECK", {
  hasUrl: !!SUPABASE_URL,
  hasServiceKey: !!SUPABASE_SERVICE_KEY,
  serviceKeyPrefix: SUPABASE_SERVICE_KEY
    ? SUPABASE_SERVICE_KEY.slice(0, 8)
    : "MISSING",
});


if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

/* 🔎 STORAGE PERMISSION TEST (RUNS ON STARTUP) */
(async () => {
  const { data, error } = await supabase
    .storage
    .from("videos")
    .list("", { limit: 5 });

  console.log("📦 STORAGE LIST TEST", { data, error });
})();

export default supabase;
