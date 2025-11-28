import supabase from "../Config/supabaseClient.js";

/**
 * GET /api/search?q=keyword
 */
export const searchContent = async (req, res) => {
  try {
    const qRaw = req.query.q;
    const q = qRaw?.trim();

    if (!q) return res.status(400).json({ error: "Query q is required" });

    const user_id = req.user?.id || null;

    // 1. Log search (safe)
    try {
      if (user_id) {
        supabase.from("search_history").insert([{ user_id, query: q }]);
      }
    } catch (_) {}

    // 2. Full-text search (your RPC)
    const { data: textRows, error: textErr } = await supabase.rpc(
      "search_fulltext",
      { search_query: q }
    );
    if (textErr) throw textErr;

    const textResults = (textRows || []).map(r => ({
      id: r.id,
      title: r.title,
      genre: r.genre,
      text_score: Number(r.similarity) || 0
    }));

    // 3. Partial search (ILIKE)
    const likeQuery = `%${q}%`;
    const { data: likeRows } = await supabase
      .from("content")
      .select("id, title, genre")
      .ilike("title", likeQuery)
      .eq("published", true);

    const partialResults = (likeRows || []).map(r => ({
      id: r.id,
      title: r.title,
      genre: r.genre,
      partial_match: 1
    }));

    // 4. Vector semantic search
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
          vector_sim: Number(r.similarity || 0)
        }));
      }
    } catch (_) {}

    // 5. Merge and score
    const scoreMap = new Map();

    const ensure = (id) => {
      if (!scoreMap.has(id)) {
        scoreMap.set(id, {
          id,
          title: "",
          genre: "",
          text_score: 0,
          vector_sim: 0,
          partial_match: 0
        });
      }
      return scoreMap.get(id);
    };

    // fill in
    for (const r of textResults) {
      const e = ensure(r.id);
      e.title = r.title;
      e.genre = r.genre;
      e.text_score = r.text_score;
    }

    for (const r of partialResults) {
      const e = ensure(r.id);
      e.title = e.title || r.title;
      e.genre = e.genre || r.genre;
      e.partial_match = 1;
    }

    for (const r of vectorResults) {
      const e = ensure(r.id);
      e.vector_sim = r.vector_sim;
    }

    // Normalize & weight
    const items = [...scoreMap.values()];
    const textMax = Math.max(...items.map(i => i.text_score), 1);
    const vectMax = Math.max(...items.map(i => i.vector_sim), 1);

    const ranked = items.map(i => {
      const textNorm = i.text_score / textMax;
      const vectNorm = i.vector_sim / vectMax;

      const final =
        0.55 * textNorm +
        0.25 * vectNorm +
        0.20 * i.partial_match;

      return { ...i, final_score: final };
    });

    // sort and return top 20
    ranked.sort((a, b) => b.final_score - a.final_score);

    return res.json({
      success: true,
      results: ranked.slice(0, 20)
    });

  } catch (err) {
    console.error("searchContent error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
