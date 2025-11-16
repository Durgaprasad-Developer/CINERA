import supabase from "../Config/supabaseClient.js";

export const getSignedStreamUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch content from DB
    const { data: content, error: contentErr } = await supabase
      .from("content")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (contentErr || !content) {
      return res.status(404).json({ error: "Content not found" });
    }

    const filePath = content.storage_path; // e.g. "videos/170000-test.mp4"

    // Extract bucket name from path → "videos/file.mp4"
    const [bucketName, ...fileParts] = filePath.split("/");
    const finalPath = fileParts.join("/");

    // Create signed streaming URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(finalPath, 60 * 60);

    if (error) throw error;

    return res.json({
      success: true,
      streamUrl: data.signedUrl,
    });

  } catch (err) {
    console.error("getSignedStreamUrl error:", err);
    next(err);
  }
};
