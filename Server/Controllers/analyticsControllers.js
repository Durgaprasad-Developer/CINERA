import supabase from "../Config/supabaseClient.js";

export const trackEvent = async (req, res) => {
  try {
    const { content_id, event_type } = req.body;
    const user_id = req.user?.id || null;

    if (!content_id || !event_type) {
      return res.status(400).json({ error: "content_id & event_type required" });
    }

    const { error } = await supabase.from("analytics").insert([
      {
        content_id,
        event_type,
        user_id
      }
    ]);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    console.error("trackEvent error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
