import supabase from "../Config/supabaseClient.js";
import { generateEmbedding } from "../Utils/embedding.js";

/* --------------------------- GET ALL CONTENT --------------------------- */
export const getAllContent = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error("getAllContent error:", err.message);
    next(err);
  }
};

/* --------------------------- CREATE CONTENT --------------------------- */
export const createContent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      tags,
      genre,
      storage_path,
      thumbnail,
      duration_seconds,
      published,
    } = req.body;

    if (!title || !storage_path) {
      return res
        .status(400)
        .json({ error: "Title and storage_path are required" });
    }

    /* --------------------------- 1. Prepare text for embedding --------------------------- */
    const textToEmbed = `
      Title: ${title}
      Description: ${description || ""}
      Genre: ${genre || ""}
      Tags: ${tags?.join(", ") || ""}
    `;

    /* --------------------------- 2. Generate Embedding --------------------------- */
    const embedding = await generateEmbedding(textToEmbed);

    /* --------------------------- 3. Insert into Supabase --------------------------- */
    const { data, error } = await supabase
      .from("content")
      .insert([
        {
          title,
          description,
          tags,
          genre,
          storage_path,
          thumbnail,
          duration_seconds,
          published,
          embedding, // <--- NEW
          uploaded_by: req.admin.sub, // From verifyAdmin middleware
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("createContent error:", err.message);
    next(err);
  }
};

/* --------------------------- UPDATE CONTENT --------------------------- */
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("content")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    console.error("updateContent error:", err.message);
    next(err);
  }
};

/* --------------------------- DELETE CONTENT --------------------------- */
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("content")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (err) {
    console.error("deleteContent error:", err.message);
    next(err);
  }
};

export const publishContent = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("content")
    .update({ published: true })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json({ success: true, data });
};

export const unpublishContent = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("content")
    .update({ published: false })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json({ success: true, data });
};

