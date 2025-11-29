import supabase from "../Config/supabaseClient.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // Basic counts
    const { count: totalContent } = await supabase
      .from("content")
      .select("*", { count: "exact", head: true });

    const { count: publishedContent } = await supabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    const { count: totalViews } = await supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "view");

    // RPC analytics
    const { data: trending } = await supabase.rpc("get_trending_content");
    const { data: popular } = await supabase.rpc("get_popular_content");
    const { data: dailyViews } = await supabase.rpc("views_last_30_days");
    const { data: completion } = await supabase.rpc("completion_rate");
    const { data: watchTime } = await supabase.rpc("watch_time_per_content");
    const { data: genres } = await supabase.rpc("genre_popularity");

    return res.json({
      success: true,
      stats: {
        totals: {
          totalContent,
          publishedContent,
          totalViews,
        },
        trending,
        popular,
        dailyViews,
        completion,
        watchTime,
        genres,
      },
    });
  } catch (err) {
    console.error("AdminDashboard error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
