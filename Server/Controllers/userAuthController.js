import supabase from "../Config/supabaseClient.js";
import { generateOtp } from "../Utils/generateOtp.js";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../Utils/verifyGoogleToken.js";
import dotenv from "dotenv";
dotenv.config();

/* --------------------------- USER SIGNUP --------------------------- */
// userSignup controller (no email calls)
export const userSignup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return res.status(400).json({ error: error.message });

    // user object
    const user = data.user;
    console.log("New signup:", user?.id, user?.email, "name:", name || "N/A");

    // NOTE: email/notification is intentionally skipped in this build
    return res.status(201).json({
      success: true,
      message: "Signup successful. (Notifications disabled in dev.)",
      user: data.user
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* --------------------------- USER LOGIN (COOKIE AUTH) --------------------------- */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email + password required" });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    const user = data.user;

    // Create our own JWT (server-side session token)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // 🔑 KEY FIX
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});



    return res.json({
      success: true,
      message: "Login successful",
      user,
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

    // Rate limiting suggestion: check how many OTPs were requested recently for this email

    const otp = generateOtp(); // e.g. 6-digit
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Save OTP record
    const { error: insertErr } = await supabase
      .from("password_reset_codes")
      .insert([{ email, otp, expires_at: expiresAt }]);

    if (insertErr) {
      console.error("DB insert OTP error:", insertErr);
      throw insertErr;
    }

    // For dev: log OTP (so you can test flow without email)
    console.log(`Password Reset OTP for ${email} → ${otp} (expires ${expiresAt.toISOString()})`);

    // Return success (do not return OTP in production)
    return res.json({
      success: true,
      message: "OTP generated. Check server logs for OTP in dev."
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

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "email, otp and newPassword required" });
    }

    // 1. Fetch the latest OTP record
    const { data: otpRows, error: otpErr } = await supabase
      .from("password_reset_codes")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpErr || !otpRows || otpRows.length === 0) {
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

    // 4. Find user by email via Supabase admin listUsers (server-side)
    const { data: userLookup, error: lookupErr } = await supabase.auth.admin.listUsers();
    if (lookupErr) {
      console.error("listUsers error:", lookupErr);
      throw lookupErr;
    }

    const user = userLookup.users.find((u) => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 5. Update password (server-side admin)
    const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    if (updateErr) {
      console.error("updateUserById error:", updateErr);
      throw updateErr;
    }

    // 6. Mark OTP record used (optional)
    await supabase.from("password_reset_codes").update({ otp: null }).eq("id", record.id);

    // Done — no email confirmation sent in this dev mode
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("verifyOtpAndReset error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* --------------------------- Logout --------------------------- */
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
});

  return res.json({ success: true, message: "Logged out" });
};

/* --------------------------- GOOGLE LOGIN --------------------------- */
export const googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: "Google ID token required" });
    }

    // 1️⃣ Verify Google Token
    const payload = await verifyGoogleToken(id_token);
    const { email, name, picture } = payload;

    // 2️⃣ Check if user exists in Supabase Auth
    const { data: allUsers, error: usersErr } = await supabase.auth.admin.listUsers();
    if (usersErr) throw usersErr;

    let existingUser = allUsers.users.find((u) => u.email === email);
    let userId;

    // 3️⃣ If user not found → create new user
    if (!existingUser) {
      const { data: newUser, error: createErr } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            name,
            avatar: picture,
            provider: "google",
          },
        });

      if (createErr) throw createErr;
      userId = newUser.user.id;
    } else {
      userId = existingUser.id;
    }

    // 4️⃣ Generate CINERA JWT
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Google login successful" });
  } catch (err) {
    console.error("googleLogin error:", err);
    return res.status(500).json({ error: "Google login failed" });
  }
};
