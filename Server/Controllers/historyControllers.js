import supabase from '../Config/supabaseClient.js';

/**
 * POST /user/history
 */
export const saveProgress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content_id, last_watched, duration } = req.body;

    if (!content_id || typeof last_watched !== "number") {
      return res.status(400).json({ error: "content_id and last_watched required" });
    }

    const duration_seconds = duration || null;

    const completed =
      duration_seconds && duration_seconds > 0
        ? last_watched >= duration_seconds * 0.9
        : false;

    // UPSERT
    const { error } = await supabase.from("watch_history").upsert(
      [
        {
          user_id,
          content_id,
          last_watched_seconds: Math.max(0, Math.floor(last_watched)),
          duration_seconds,
          completed,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: ["user_id", "content_id"] }
    );

    if (error) throw error;

    // Correct analytics event
    const eventType = completed ? "complete" : "watch_progress";

    await supabase.from("analytics").insert([
      {
        content_id,
        event_type: eventType,
        user_id,
      },
    ]);

    return res.json({ success: true });
  } catch (err) {
    console.error("saveProgress error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * GET /user/history
 */
export const getUserHistory = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("watch_history")
      .select(
        "content_id, last_watched_seconds, duration_seconds, completed, updated_at"
      )
      .eq("user_id", user_id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.json({ history: data || [] });
  } catch (err) {
    console.error("getUserHistory error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * GET /user/history/:contentId
 */
export const getProgressForContent = async (req, res) => {
  try {
    const user_id = req.user.id;
    const contentId = req.params.contentId;

    const { data, error } = await supabase
      .from("watch_history")
      .select(
        "content_id, last_watched_seconds, duration_seconds, completed, updated_at"
      )
      .eq("user_id", user_id)
      .eq("content_id", contentId)
      .maybeSingle();

    return res.json({ progress: data || null });
  } catch (err) {
    console.error("getProgressForContent error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * GET /user/continue-watching
 */
export const getContinueWatching = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("watch_history")
      .select(
        `
        content_id,
        last_watched_seconds,
        duration_seconds,
        updated_at,
        completed,
        content (
          title,
          thumbnail,
          duration_seconds
        )
      `
      )
      .eq("user_id", user_id)
      .eq("completed", false)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.json({ continueWatching: data || [] });
  } catch (err) {
    console.error("getContinueWatching error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

