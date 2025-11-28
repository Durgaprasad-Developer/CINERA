import supabase from "../Config/supabaseClient.js";

export const getUserRecommendations = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Fetch user taste vector
    const { data: taste } = await supabase
      .from("user_taste")
      .select("taste_vector")
      .eq("user_id", user_id)
      .maybeSingle();

    let recommended = [];

    if (taste?.taste_vector) {
      // 2. Use personalized recommendations
      const { data, error } = await supabase.rpc(
        "recommend_for_user",
        {
          query_embedding: taste.taste_vector,
          match_count: 30
        }
      );

      if (!error) recommended = data;
    }

    // 3. If no taste → cold start
    if (recommended.length === 0) {
      const { data: trending } = await supabase.rpc("get_trending_content");

      if (trending?.length > 0) {
        const ids = trending.map(t => t.content_id);

        const { data: trendingContent } = await supabase
          .from("content")
          .select("*")
          .in("id", ids)
          .eq("published", true);

        recommended = trendingContent || [];
      } else {
        // fallback random
        const { data: random } = await supabase
          .from("content")
          .select("*")
          .eq("published", true)
          .limit(20);

        recommended = random;
      }
    }

    // 4. Remove completed content
    const { data: completedRows } = await supabase
      .from("watch_history")
      .select("content_id")
      .eq("user_id", user_id)
      .eq("completed", true);

    const completedIds = new Set(completedRows?.map(r => r.content_id) || []);

    const finalList = recommended.filter(c => !completedIds.has(c.id));

    return res.json({ success: true, data: finalList });
  } catch (err) {
    console.error("getUserRecommendations error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
