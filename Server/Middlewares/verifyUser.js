import supabase from "../Config/supabaseClient.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Authorization required" });

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = data.user;
    next();

  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
