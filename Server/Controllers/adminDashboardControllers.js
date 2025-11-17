import supabase from "../Config/supabaseClient.js";

export const getAdminStats = async (req, res) => {
  try {
    // count content
    const { count: totalContent } = await supabase
      .from("content")
      .select("*", { count: "exact", head: true });

    const { count: publishedContent } = await supabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    // count analytics events
    const { count: totalViews } = await supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "view");

    // trending (top 5)
    const { data: trending } = await supabase
      .from("analytics")
      .select("content_id, count(*)")
      .eq("event_type", "view")
      .group("content_id")
      .order("count", { ascending: false })
      .limit(5);

    return res.json({
      success: true,
      stats: {
        totalContent,
        publishedContent,
        totalViews,
        trending
      }
    });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
