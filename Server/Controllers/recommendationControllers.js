import supabase from "../Config/supabaseClient.js";

/**
 * GET /api/content/:id/similar
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

    if (baseErr || !baseContent || !baseContent.embedding) {
      return res
        .status(404)
        .json({ error: "Content not found or embedding missing" });
    }

    const targetEmbedding = baseContent.embedding;

    // 2. query similar movies using vector comparison (RPC returns ids + similarity)
    const { data: similarRows, error: simErr } = await supabase.rpc(
      "match_content",
      {
        query_embedding: targetEmbedding,
        match_count: 12,
      }
    );

    if (simErr) throw simErr;
    if (!Array.isArray(similarRows))
      return res.json({ success: true, data: [] });

    // 3. filter out the current id and fetch content metadata
    const filtered = similarRows.filter((r) => r.id !== id).map((r) => r.id);
    if (filtered.length === 0) return res.json({ success: true, data: [] });

    const { data: contents, error: contentErr } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .in("id", filtered)
      .order("created_at", { ascending: false });

    if (contentErr) throw contentErr;

    // Map similarity into content objects (match order may change; we'll attach similarity)
    const similarityMap = new Map(
      similarRows.map((r) => [r.id, r.similarity || 0])
    );
    const enriched = contents
      .map((c) => ({
        ...c,
        similarity: similarityMap.get(c.id) || 0,
      }))
      .sort((a, b) => b.similarity - a.similarity); // DESC

    return res.json({ success: true, data: enriched });
  } catch (err) {
    console.error("getSimilarContent error:", err);
    next(err);
  }
};
