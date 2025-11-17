import supabase from "../Config/supabaseClient.js";

export const getAdminStats = async (req, res) => {
  try {
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

    // Trending using RPC
    const { data: trending, error: trendErr } =
      await supabase.rpc("get_trending_content");

    if (trendErr) throw trendErr;

    return res.json({
      success: true,
      stats: {
        totalContent,
        publishedContent,
        totalViews,
        trending,
      },
    });

  } catch (err) {
    console.error("Admin stats error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
