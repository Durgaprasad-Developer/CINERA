import supabase from "../Config/supabaseClient.js";

/**
 * @desc  Get similar movies using vector similarity
 * @route GET /api/content/:id/similar
 */
export const getSimilarContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. get embedding of the movie
    const { data: baseContent, error: baseErr } = await supabase
      .from("content")
      .select("embedding")
      .eq("id", id)
      .single();

    if (baseErr || !baseContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    const targetEmbedding = baseContent.embedding;

    // 2. query similar movies using vector comparison
    const { data: similar, error: simErr } = await supabase.rpc(
      "match_content",
      {
        query_embedding: targetEmbedding,
        match_count: 10
      }
    );

    if (simErr) throw simErr;

    return res.json({
      success: true,
      data: similar
    });
  } catch (err) {
    console.error("getSimilarContent error:", err);
    next(err);
  }
};
