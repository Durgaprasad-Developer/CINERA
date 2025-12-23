import supabase from "../Config/supabaseClient.js";
import { trackEvent } from "../Utils/trackAnalytics.js";

export const getSignedStreamUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ SAFE user handling (auth will NOT crash streaming)
    const userId = req.user?.id ?? "anonymous";

    // Track analytics (non-blocking)
    try {
      trackEvent(userId, id, "view");
    } catch (e) {
      console.warn("Analytics failed:", e.message);
    }

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

    // 🔍 Log once for observability
    console.log("[STREAM]", { id, filePath });

    // SAME logic you had
    const [bucketName, ...fileParts] = filePath.split("/");
    const finalPath = fileParts.join("/");

    if (!bucketName || !finalPath) {
      return res.status(400).json({ error: "Invalid storage path" });
    }

    // Signed streaming URL (1 hour)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(finalPath, 60 * 60);

    if (error) {
      console.error("Supabase storage error:", {
        bucketName,
        finalPath,
        message: error.message,
      });

      return res.status(404).json({
        error: "Video not available",
      });
    }

    return res.json({
      success: true,
      streamUrl: data.signedUrl,
    });

  } catch (err) {
    console.error("getSignedStreamUrl fatal error:", err);
    return res.status(500).json({
      error: "Streaming failed",
    });
  }
};