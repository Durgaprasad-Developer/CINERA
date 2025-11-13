import supabase from "../Config/supabaseClient.js";

/**
 * @desc  Fetch all content
 * @route GET /api/admin/content
 */
export const getAllContent = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("content").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error("getAllContent error:", err.message);
    next(err);
  }
};

/**
 * @desc  Add new content
 * @route POST /api/admin/content
 */
export const createContent = async (req, res, next) => {
  try {
    const { title, description, tags, genre, storage_path, thumbnail, duration_seconds, published } = req.body;

    if (!title || !storage_path) {
      return res.status(400).json({ error: "Title and storage_path are required" });
    }

    const { data, error } = await supabase.from("content").insert([
      {
        title,
        description,
        tags,
        genre,
        storage_path,
        thumbnail,
        duration_seconds,
        published,
        uploaded_by: req.admin.sub, // from verifyAdmin middleware
      },
    ]).select();

    if (error) throw error;
    return res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    console.error("createContent error:", err.message);
    next(err);
  }
};

/**
 * @desc  Update content by ID
 * @route PUT /api/admin/content/:id
 */
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase.from("content").update(updates).eq("id", id).select();
    if (error) throw error;

    return res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error("updateContent error:", err.message);
    next(err);
  }
};

/**
 * @desc  Delete content by ID
 * @route DELETE /api/admin/content/:id
 */
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) throw error;

    return res.json({ success: true, message: "Content deleted successfully" });
  } catch (err) {
    console.error("deleteContent error:", err.message);
    next(err);
  }
};
