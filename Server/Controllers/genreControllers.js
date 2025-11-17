import supabase from "../Config/supabaseClient.js";

export const createGenre = async (req, res) => {
  const { name } = req.body;

  const { data, error } = await supabase
    .from("genres")
    .insert([{ name }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ success: true, data });
};

export const getGenres = async (req, res) => {
  const { data } = await supabase.from("genres").select("*");
  res.json({ success: true, data });
};

export const deleteGenre = async (req, res) => {
  const { id } = req.params;

  await supabase.from("genres").delete().eq("id", id);

  res.json({ success: true });
};
