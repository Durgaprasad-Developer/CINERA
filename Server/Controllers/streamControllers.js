import supabase from "../Config/supabaseClient.js";
import { trackEvent } from "../Utils/trackAnalytics.js";

export const getSignedStreamUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TEMPORARY (until we build user auth)
    const userId = req.user.id;  // or a hardcoded UUID for testing analytics

    // Track analytics (view event)
    trackEvent(userId, id, "view");

    // Fetch content from DB
    const { data: content, error: contentErr } = await supabase
      .from("content")
      .select("storage_path")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (contentErr || !content) {
      return res.status(404).json({ error: "Content not found" });
    }

    const filePath = content.storage_path;

    const [bucketName, ...fileParts] = filePath.split("/");
    const finalPath = fileParts.join("/");

    // Signed streaming URL (1 hour)
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
