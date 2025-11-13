import supabase from '../Config/supabaseClient.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '2h';

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email + password required' });

    // Sign in user via Supabase Auth (server-side using service key)
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInErr || !signInData?.user) {
      console.error('Supabase signIn error:', signInErr);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userId = signInData.user.id;

    // Check admins table for this user id
    const { data: adminRow, error: adminErr } = await supabase
      .from('admins')
      .select('id, role, display_name, email')
      .eq('id', userId)
      .maybeSingle();

    if (adminErr) {
      console.error('DB admin lookup error:', adminErr);
      return res.status(500).json({ error: 'Server error' });
    }

    if (!adminRow) {
      return res.status(403).json({ error: 'Not an admin' });
    }

    // Create server JWT for admin sessions
    const tokenPayload = {
      sub: userId,
      email: signInData.user.email,
      role: adminRow.role || 'admin',
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({
      message: 'Admin login success',
      token,
      admin: {
        id: adminRow.id,
        display_name: adminRow.display_name,
        email: adminRow.email,
        role: adminRow.role,
      },
    });
  } catch (err) {
    console.error('adminLogin error:', err);
    return next(err);
  }
};
