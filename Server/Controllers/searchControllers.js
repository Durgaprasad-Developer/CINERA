import supabase from "../Config/supabaseClient.js";

/**
 * GET /api/search?q=keyword
 */
export const searchContent = async (req, res) => {
  try {
    const qRaw = req.query.q;
    const q = qRaw?.trim();

    if (!q) {
      return res.status(400).json({ error: "Query q is required" });
    }

    const user_id = req.user?.id || null;

    // 1️⃣ Log search (fire-and-forget)
    try {
      if (user_id) {
        supabase.from("search_history").insert([{ user_id, query: q }]);
      }
    } catch (_) {}

    /* ---------------- TEXT SEARCH ---------------- */
    const { data: textRows, error: textErr } = await supabase.rpc(
      "search_fulltext",
      { search_query: q }
    );
    if (textErr) throw textErr;

    const textResults = (textRows || []).map(r => ({
      id: r.id,
      text_score: Number(r.similarity) || 0,
    }));

    /* ---------------- PARTIAL TITLE MATCH ---------------- */
    const likeQuery = `%${q}%`;
    const { data: likeRows } = await supabase
      .from("content")
      .select("id")
      .ilike("title", likeQuery)
      .eq("published", true);

    const partialResults = (likeRows || []).map(r => ({
      id: r.id,
      partial_match: 1,
    }));

    /* ---------------- VECTOR SEARCH ---------------- */
    let vectorResults = [];
    try {
      const { data: emb } = await supabase.rpc("generate_query_embedding", {
        input_text: q,
      });

      if (emb) {
        const { data: vData } = await supabase.rpc("match_content", {
          query_embedding: emb,
          match_count: 20,
        });

        vectorResults = (vData || []).map(r => ({
          id: r.id,
          vector_sim: Number(r.similarity) || 0,
        }));
      }
    } catch (_) {}

    /* ---------------- MERGE & SCORE ---------------- */
    const scoreMap = new Map();

    const ensure = (id) => {
      if (!scoreMap.has(id)) {
        scoreMap.set(id, {
          id,
          text_score: 0,
          vector_sim: 0,
          partial_match: 0,
        });
      }
      return scoreMap.get(id);
    };

    for (const r of textResults) {
      ensure(r.id).text_score = r.text_score;
    }

    for (const r of partialResults) {
      ensure(r.id).partial_match = 1;
    }

    for (const r of vectorResults) {
      ensure(r.id).vector_sim = r.vector_sim;
    }

    const items = [...scoreMap.values()];
    if (items.length === 0) {
      return res.json({ success: true, results: [] });
    }

    const textMax = Math.max(...items.map(i => i.text_score), 1);
    const vectMax = Math.max(...items.map(i => i.vector_sim), 1);

    const ranked = items
      .map(i => {
        const textNorm = i.text_score / textMax;
        const vectNorm = i.vector_sim / vectMax;

        const final_score =
          0.55 * textNorm +
          0.25 * vectNorm +
          0.20 * i.partial_match;

        return { id: i.id, final_score };
      })
      .sort((a, b) => b.final_score - a.final_score)
      .slice(0, 20);

    /* ---------------- FETCH UI-READY CONTENT ---------------- */
    const ids = ranked.map(r => r.id);

    const { data: contents, error: contentErr } = await supabase
      .from("content")
      .select("id, title, genre, thumbnail, duration_seconds")
      .in("id", ids)
      .eq("published", true);

    if (contentErr) throw contentErr;

    return res.json({
      success: true,
      results: contents,
    });

  } catch (err) {
    console.error("searchContent error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
