import supabase from "../Config/supabaseClient.js";
import storageSupabase from "../Config/storageSupabase.js";
import { trackEvent } from "../Utils/trackAnalytics.js";

export const getSignedStreamUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id ?? "anonymous";

    try {
      trackEvent(userId, id, "view");
    } catch (e) { }

    // 🔹 DB query still uses app client (SAFE)
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
    console.log("[STREAM]", { id, filePath });

    const [bucketName, ...fileParts] = filePath.split("/");
    const finalPath = fileParts.join("/");

    if (!bucketName || !finalPath) {
      return res.status(400).json({ error: "Invalid storage path" });
    }

    // 🎯 SIGNED URL — STORAGE CLIENT ONLY
    const { data, error } = await storageSupabase.storage
      .from(bucketName)
      .createSignedUrl(finalPath, 60 * 60);

    console.log("🎥 STREAM DEBUG", {
      time: new Date().toISOString(),
      contentId: id,
      bucketName,
      finalPath,
      signedUrlExists: !!data?.signedUrl,
      error: error?.message,
    });

    if (error) {
      return res.status(404).json({ error: "Video not available" });
    }

    return res.json({
      success: true,
      streamUrl: data.signedUrl,
    });

  } catch (err) {
    console.error("getSignedStreamUrl fatal error:", err);
    return res.status(500).json({ error: "Streaming failed" });
  }
};
