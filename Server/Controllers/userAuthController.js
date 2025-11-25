import supabase from "../Config/supabaseClient.js";
import { generateOtp } from "../Utils/generateOtp.js";

/* --------------------------- USER SIGNUP --------------------------- */
export const userSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({
      success: true,
      message: "Signup successful. Check your email for verification.",
      user: data.user
    });

  } catch (err) {
    console.error("userSignup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* --------------------------- USER LOGIN --------------------------- */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      success: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    });

  } catch (err) {
    console.error("userLogin error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* --------------------------- SEND RESET OTP --------------------------- */
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const { error: insertErr } = await supabase
      .from("password_reset_codes")
      .insert([{ email, otp, expires_at: expiresAt }]);

    if (insertErr) throw insertErr;

    // TEMP: Log OTP for now
    console.log("Password Reset OTP:", otp);

    return res.json({
      success: true,
      message: "OTP generated. (Check server console for development)"
    });

  } catch (err) {
    console.error("sendResetOtp error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* --------------------------- VERIFY OTP & RESET PASSWORD --------------------------- */
export const verifyOtpAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Fetch the latest OTP record
    const { data: otpRows, error: otpErr } = await supabase
      .from("password_reset_codes")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpErr || otpRows.length === 0) {
      return res.status(400).json({ error: "OTP not found" });
    }

    const record = otpRows[0];

    // 2. Validate OTP
    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 3. Check expiry
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // 4. Get user ID by email
    const { data: userLookup, error: lookupErr } = await supabase.auth.admin.listUsers();
    if (lookupErr) throw lookupErr;

    const user = userLookup.users.find(u => u.email === email);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    // 5. Update password
    const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });

    if (updateErr) throw updateErr;

    return res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (err) {
    console.error("verifyOtpAndReset error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

