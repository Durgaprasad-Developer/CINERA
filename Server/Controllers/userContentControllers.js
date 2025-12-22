import supabase from "../Config/supabaseClient.js";

/* ---------------- GET CONTENT DETAIL (USER) ---------------- */
export const getContentDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("content")
      .select(
        `
        id,
        title,
        description,
        tags,
        genre,
        thumbnail,
        duration_seconds,
        created_at
        `
      )
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Content not found" });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("getContentDetail error:", err.message);
    next(err);
  }
};
