// Middlewares/verifySubscription.js
import supabase from "../Config/supabaseClient.js";

export const verifySubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gte("expiry_date", new Date().toISOString())
      .order("expiry_date", { ascending: false })
      .limit(1);

    if (error) {
      console.error("verifySubscription db error:", error);
      return res.status(500).json({ error: "Server error" });
    }

    const active = data && data.length > 0;
    if (!active) {
      return res.status(402).json({ error: "Subscription required" });
    }

    req.subscription = data[0];
    next();
  } catch (err) {
    console.error("verifySubscription error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
