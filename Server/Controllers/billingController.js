import supabase from "../Config/supabaseClient.js";
import { razorpay } from "../Config/razorpayClient.js";
import crypto from "crypto";

/* ---------------- CREATE ORDER ---------------- */
export const createOrder = async (req, res) => {
  try {
    const { plan_id } = req.body;
    const user_id = req.user.id;

    // Fetch plan
    const { data: plan, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (error || !plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price, // in paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    // Save to subscriptions table
    await supabase.from("subscriptions").insert([
      {
        user_id,
        plan_id,
        order_id: order.id,
        amount: plan.price,
        status: "pending"
      }
    ]);

    return res.json({ success: true, order, plan });

  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- VERIFY PAYMENT ---------------- */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const user_id = req.user.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid Signature" });
    }

    // Update subscription
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("order_id", razorpay_order_id)
      .single();

    const start = new Date();
    const expiry = new Date(start);
    expiry.setDate(start.getDate() + subs.duration_days ?? 30);

    await supabase
      .from("subscriptions")
      .update({
        payment_id: razorpay_payment_id,
        status: "active",
        start_date: start,
        expiry_date: expiry
      })
      .eq("order_id", razorpay_order_id);

    return res.json({ success: true, message: "Payment verified" });

  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- CHECK ACTIVE SUBSCRIPTION ---------------- */
export const getSubscriptionStatus = async (req, res) => {
  const user_id = req.user.id;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .eq("status", "active")
    .single();

  return res.json({
    active: Boolean(data),
    subscription: data || null,
  });
};
