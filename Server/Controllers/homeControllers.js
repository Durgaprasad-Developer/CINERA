import supabase from "../Config/supabaseClient.js";

/* Trending */
export const getTrending = async (req, res) => {
  try {
    const { data: rows } = await supabase.rpc("get_trending_content");

    if (!rows || rows.length === 0)
      return res.json({ success: true, data: [] });

    const ids = rows.map(r => r.content_id);

    const { data } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .in("id", ids)
      .eq("published", true);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("getTrending error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


/* Most Popular */
export const getPopular = async (req, res) => {
  try {
    const { data: rows } = await supabase.rpc("get_popular_content");

    if (!rows || rows.length === 0)
      return res.json({ success: true, data: [] });

    const ids = rows.map(r => r.content_id);

    const { data } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .in("id", ids)
      .eq("published", true);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("getPopular error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


/* Recently Added */
export const getRecent = async (req, res) => {
  try {
    const { data } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(20);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("getRecent error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* Genre Rows */
export const getByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const { data } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .eq("genre", genre)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(20);

    res.json({ success: true, data });
  } catch (err) {
    console.error("getByGenre error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
