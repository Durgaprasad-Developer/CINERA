import supabase from "../Config/supabaseClient.js";

export const generateUploadUrl = async (req, res, next) => {
  try {
    const { fileName, bucket } = req.body;

    if (!fileName || !bucket) {
      return res.status(400).json({ error: "fileName and bucket required" });
    }

    // File path inside bucket
    const filePath = `${Date.now()}-${fileName}`;

    // Signed upload URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) throw error;

    return res.json({
      success: true,
      uploadUrl: data.signedUrl,
      filePath: `${bucket}/${filePath}`,
    });
  } catch (err) {
    console.error("generateUploadUrl error:", err.message);
    next(err);
  }
};