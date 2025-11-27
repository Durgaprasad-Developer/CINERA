import supabase from "../Config/supabaseClient.js";
import { generateOtp } from "../Utils/generateOtp.js";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../Utils/verifyGoogleToken.js";

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

/* --------------------------- USER LOGIN (COOKIE AUTH) --------------------------- */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    const user = data.user;

    // Create our own JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // user stays logged in for 7 days
    );

    res.cookie("cinera_auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict", 
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

/* --------------------------- Logout --------------------------- */

export const logoutUser = (req, res) => {
  res.clearCookie("cinera_auth", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
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
    const { email, name, picture, sub } = payload;

    // 2️⃣ Check if user exists in Supabase Auth
    let { data: existingUser } = await supabase.auth.admin.listUsers();
    existingUser = existingUser.users.find((u) => u.email === email);

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
    res.cookie("cinera_auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Google login successful" });
  } catch (err) {
    console.error("googleLogin error:", err);
    return res.status(500).json({ error: "Google login failed" });
  }
};


