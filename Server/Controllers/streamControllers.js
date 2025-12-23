import supabase from "../Config/supabaseClient.js";
import { createServiceSupabaseClient } from "../Utils/supabaseServiceClient.js";
import { trackEvent } from "../Utils/trackAnalytics.js";

export const getSignedStreamUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user?.id ?? "anonymous";

    try {
      trackEvent(userId, id, "view");
    } catch {}

    // ✅ DB access uses shared client
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

    // ✅ STORAGE uses fresh client
    const serviceSupabase = createServiceSupabaseClient();

    const { data, error } = await serviceSupabase.storage
      .from(bucketName)
      .createSignedUrl(finalPath, 60 * 60);

    if (error) {
      console.error("Supabase storage error:", error.message);
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
