import supabase from "../Config/supabaseClient.js";

/* ---------------------- LIKE CONTENT ---------------------- */
export const likeContent = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content_id } = req.body;

    if (!content_id) return res.status(400).json({ error: "content_id required" });

    // Upsert: set liked = true
    const { error } = await supabase.from("favorites").upsert(
      [
        {
          user_id,
          content_id,
          liked: true,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: ["user_id", "content_id"] }
    );

    if (error) throw error;

    // Emit analytics event
    await supabase.from("analytics").insert([
      { user_id, content_id, event_type: "like" },
    ]);

    return res.json({ success: true, message: "Liked" });
  } catch (err) {
    console.error("likeContent error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------------- UNLIKE CONTENT ---------------------- */
export const unlikeContent = async (req, res) => {
  try {
    const user_id = req.user.id;
    const content_id = req.params.contentId;

    const { error } = await supabase
      .from("favorites")
      .update({ liked: false })
      .eq("user_id", user_id)
      .eq("content_id", content_id);

    if (error) throw error;

    return res.json({ success: true, message: "Unliked" });
  } catch (err) {
    console.error("unlikeContent error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------------- FAVORITE CONTENT ---------------------- */
export const favoriteContent = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content_id } = req.body;

    if (!content_id) return res.status(400).json({ error: "content_id required" });

    const { error } = await supabase.from("favorites").upsert(
      [
        {
          user_id,
          content_id,
          favorited: true,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: ["user_id", "content_id"] }
    );

    if (error) throw error;

    // analytics event
    await supabase.from("analytics").insert([
      { user_id, content_id, event_type: "favorite" },
    ]);

    return res.json({ success: true, message: "Added to Favorites" });
  } catch (err) {
    console.error("favoriteContent error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------------- REMOVE FAVORITE ---------------------- */
export const unfavoriteContent = async (req, res) => {
  try {
    const user_id = req.user.id;
    const content_id = req.params.contentId;

    const { error } = await supabase
      .from("favorites")
      .update({ favorited: false })
      .eq("user_id", user_id)
      .eq("content_id", content_id);

    if (error) throw error;

    return res.json({ success: true, message: "Removed from Favorites" });
  } catch (err) {
    console.error("unfavoriteContent error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------------- GET ALL FAVORITES ---------------------- */
export const getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        content_id,
        favorited,
        liked,
        content (
          title,
          thumbnail,
          genre,
          duration_seconds
        )
      `
      )
      .eq("user_id", user_id)
      .eq("favorited", true)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.json({ favorites: data });
  } catch (err) {
    console.error("getFavorites error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------------- GET ALL LIKES ---------------------- */
export const getLikes = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        content_id,
        liked,
        content (
          title,
          thumbnail,
          genre,
          duration_seconds
        )
      `
      )
      .eq("user_id", user_id)
      .eq("liked", true)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.json({ likes: data });
  } catch (err) {
    console.error("getLikes error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
