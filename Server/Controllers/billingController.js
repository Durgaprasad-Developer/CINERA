// Controllers/billingController.js
import supabase from "../Config/supabaseClient.js";
import { razorpay } from "../Config/razorpayClient.js";
import crypto from "crypto";

/* ---------------- CREATE ORDER ---------------- */
export const createOrder = async (req, res) => {
  try {
    const { plan_id } = req.body;
    const user_id = req.user.id;

    if (!plan_id) return res.status(400).json({ error: "plan_id required" });

    // Fetch plan
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (planError || !plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price, // in paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
      notes: { plan_id: plan.id, plan_name: plan.name, user_id }
    });

    // Save to subscriptions table (we treat this as payment record for one-time purchase)
    const { error: insertError } = await supabase.from("subscriptions").insert([
      {
        user_id,
        plan_id,
        order_id: order.id,
        amount: plan.price,
        status: "pending"
      }
    ]);

    if (insertError) {
      console.error("subscriptions insert error:", insertError);
      // still return order for client to attempt payment
    }

    return res.json({ success: true, order, plan });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- VERIFY PAYMENT (client posts razorpay fields) ---------------- */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const user_id = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    // compute expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid Signature" });
    }

    // find pending record
    const { data: subs, error: subsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("order_id", razorpay_order_id)
      .single();

    if (subsError || !subs) {
      console.error("Subscription record not found:", subsError);
      return res.status(404).json({ error: "Subscription record not found" });
    }

    // fetch plan duration_days (if you want expiry; for one-time we can still set expiry to now+duration_days)
    const { data: plan } = await supabase
      .from("plans")
      .select("*")
      .eq("id", subs.plan_id)
      .single();

    const durationDays = (plan && plan.duration_days) ? plan.duration_days : 30;
    const start = new Date();
    const expiry = new Date(start);
    expiry.setDate(start.getDate() + durationDays);

    // update record to active
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        payment_id: razorpay_payment_id,
        status: "active",
        start_date: start.toISOString(),
        expiry_date: expiry.toISOString()
      })
      .eq("order_id", razorpay_order_id);

    if (updateError) {
      console.error("Failed updating subscription status:", updateError);
      return res.status(500).json({ error: "Failed to update subscription" });
    }

    return res.json({ success: true, message: "Payment verified", expiry_date: expiry.toISOString() });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- GET PAYMENT / SUBSCRIPTION STATUS ---------------- */
export const getSubscriptionStatus = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "active")
      .order("expiry_date", { ascending: false })
      .limit(1);

    const activeSub = (data && data[0]) ? data[0] : null;

    return res.json({
      active: Boolean(activeSub),
      subscription: activeSub,
    });
  } catch (err) {
    console.error("getSubscriptionStatus error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- USER PAYMENT HISTORY ---------------- */
export const getPaymentHistory = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, plan_id, order_id, payment_id, amount, status, start_date, expiry_date, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getPaymentHistory error:", error);
      return res.status(500).json({ error: "DB error" });
    }

    return res.json({ success: true, payments: data });
  } catch (err) {
    console.error("getPaymentHistory error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/* ---------------- CREATE PAYMENT LINK (optional UPI friendly) ---------------- */
export const createPaymentLink = async (req, res) => {
  try {
    const { plan_id } = req.body;
    const user_id = req.user.id;

    const { data: plan, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (error || !plan) return res.status(404).json({ error: "Plan not found" });

    const payload = {
      amount: plan.price,
      currency: "INR",
      accept_partial: false,
      description: `${plan.name} subscription`,
      notify: { sms: false, email: false },
      reminder_enable: true
    };

    const link = await razorpay.paymentLink.create(payload);

    await supabase.from("subscriptions").insert([
      {
        user_id,
        plan_id,
        order_id: link.id,
        amount: plan.price,
        status: "pending"
      }
    ]);

    return res.json({ success: true, link });
  } catch (err) {
    console.error("createPaymentLink error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- RAZORPAY WEBHOOK (raw body) ----------------
   NOTE: route must use express.raw() so req.body is raw bytes string.
-------------------------------------------------------- */
export const razorpayWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");

    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.rawBody?.toString());
    console.log("Parsed Body:", req.body);

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const body = req.rawBody || JSON.stringify(req.body);

    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    console.log("✅ Signature verified");

const raw = req.rawBody?.toString();

let jsonBody;
try {
  jsonBody = JSON.parse(raw);
} catch (err) {
  console.error("❌ JSON Parse Error:", err);
  return res.status(400).json({ error: "Invalid JSON" });
}

console.log("Parsed JSON:", jsonBody);

const event = jsonBody.event;
const payload = jsonBody.payload;


    console.log("📩 Event:", event);

    // handle payment captured - mark active if order_id matches
    if (event === "payment.captured" || event === "order.paid") {
      console.log("🔥 Processing successful payment event");

      const paymentEntity = payload?.payment?.entity || payload?.order?.entity || null;
      const orderId = paymentEntity?.order_id || payload?.order?.entity?.id || null;
      const paymentId = paymentEntity?.id || null;

      console.log("Order ID:", orderId);
      console.log("Payment ID:", paymentId);

      if (orderId) {
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("order_id", orderId)
          .single();

        console.log("Subscription Lookup:", subs);

        if (subs) {
          const { data: plan } = await supabase
            .from("plans")
            .select("*")
            .eq("id", subs.plan_id)
            .single();

          console.log("Plan found:", plan);

          const durationDays = plan?.duration_days || 30;
          const start = new Date();
          const expiry = new Date(start);
          expiry.setDate(start.getDate() + durationDays);

          await supabase
            .from("subscriptions")
            .update({
              payment_id: paymentId,
              status: "active",
              start_date: start.toISOString(),
              expiry_date: expiry.toISOString()
            })
            .eq("order_id", orderId);

          console.log("✅ Subscription updated successfully");
        }
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("razorpayWebhook error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

