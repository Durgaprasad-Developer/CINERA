import supabase from "../Config/supabaseClient.js";

/**
 * GET /api/recommendations/content/:id/similar
 */
export const getSimilarContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get embedding of base content
    const { data: baseContent, error: baseErr } = await supabase
      .from("content")
      .select("embedding")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (baseErr || !baseContent?.embedding) {
      return res.json({ success: true, data: [] });
    }

    // 2️⃣ Vector similarity search
    const { data: similarRows, error: simErr } = await supabase.rpc(
      "match_content",
      {
        query_embedding: baseContent.embedding,
        match_count: 12,
      }
    );

    if (simErr || !Array.isArray(similarRows)) {
      return res.json({ success: true, data: [] });
    }

    // 3️⃣ Remove current content ID
    const ids = similarRows
      .map((r) => r.id)
      .filter((cid) => cid !== id);

    if (!ids.length) {
      return res.json({ success: true, data: [] });
    }

    // 4️⃣ Fetch UI-ready content (published only)
    const { data: contents, error: contentErr } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .in("id", ids)
      .eq("published", true);

    if (contentErr) throw contentErr;

    // 5️⃣ Sort using similarity (INTERNAL ONLY)
    const similarityMap = new Map(
      similarRows.map((r) => [r.id, r.similarity || 0])
    );

    const sorted = contents.sort(
      (a, b) =>
        (similarityMap.get(b.id) || 0) -
        (similarityMap.get(a.id) || 0)
    );

    return res.json({
      success: true,
      data: sorted,
    });
  } catch (err) {
    console.error("getSimilarContent error:", err);
    next(err);
  }
};
