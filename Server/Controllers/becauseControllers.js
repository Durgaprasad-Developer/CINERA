import supabase from "../Config/supabaseClient.js";

export const becauseYouWatched = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Get last completed content
    const { data: lastCompleted } = await supabase
      .from("watch_history")
      .select("content_id")
      .eq("user_id", user_id)
      .eq("completed", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (!lastCompleted) {
      return res.json({ success: true, data: [] });
    }

    const contentId = lastCompleted.content_id;

    // 2. Use similar content RPC
    const { data: similar } = await supabase.rpc("match_content", {
      query_embedding: (await supabase
        .from("content")
        .select("embedding")
        .eq("id", contentId)
        .single()).data.embedding,
      match_count: 12
    });

    // Remove the content itself
    const cleaned = similar.filter(s => s.id !== contentId);

    return res.json({ success: true, data: cleaned });
  } catch (err) {
    console.error("becauseYouWatched error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
