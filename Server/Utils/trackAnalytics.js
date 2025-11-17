import supabase from "../Config/supabaseClient.js";

export const trackEvent = async (userId, contentId, eventType) => {
  try {
    await supabase.from("analytics").insert([
      {
        user_id: userId,
        content_id: contentId,
        event_type: eventType
      }
    ]);
  } catch (err) {
    console.error("Analytics error:", err.message);
  }
};
