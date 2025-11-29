import supabase from "../Config/supabaseClient.js";
import { sendEmail } from "../Utils/emailClient.js";

/**
 * Send welcome email after signup
 */
export const sendWelcomeEmail = async (user_id, email, name) => {
  await supabase.from("notifications").insert({
    user_id,
    type: "welcome",
    title: "Welcome to CINERA",
    message: `Welcome ${name}, your account is ready!`,
  });

  await sendEmail({
    to: email,
    subject: "Welcome to CINERA 🎬",
    html: `<h2>Welcome ${name}!</h2><p>Your CINERA journey begins now.</p>`,
  });
};

/**
 * Notify user of new content
 */
export const notifyNewContent = async (user_id, email, content_title) => {
  await supabase.from("notifications").insert({
    user_id,
    type: "new_content",
    title: `New Content: ${content_title}`,
    message: `${content_title} is now available to watch!`,
  });

  await sendEmail({
    to: email,
    subject: `New Release: ${content_title}`,
    html: `<h2>New Content!</h2><p>${content_title} is live now on CINERA.</p>`,
  });
};

/**
 * Get notifications for user
 */
export const getUserNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, notifications: data });
  } catch (err) {
    console.error("getUserNotifications error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
