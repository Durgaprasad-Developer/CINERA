// Controllers/adminPlansController.js
import supabase from "../Config/supabaseClient.js";

export const createPlan = async (req, res) => {
  try {
    const { name, price, duration_days } = req.body;
    if (!name || !price || !duration_days) return res.status(400).json({ error: "Missing fields" });

    const { data, error } = await supabase
      .from("plans")
      .insert([{ name, price, duration_days }])
      .select()
      .single();

    if (error) {
      console.error("createPlan error:", error);
      return res.status(500).json({ error: "DB error" });
    }

    return res.json({ success: true, plan: data });
  } catch (err) {
    console.error("createPlan catch:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from("plans")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("updatePlan error:", error);
      return res.status(500).json({ error: "DB error" });
    }

    return res.json({ success: true, plan: data });
  } catch (err) {
    console.error("updatePlan catch:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deletePlan error:", error);
      return res.status(500).json({ error: "DB error" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("deletePlan catch:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listPlans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("price", { ascending: true });

    if (error) {
      console.error("listPlans error:", error);
      return res.status(500).json({ error: "DB error" });
    }

    return res.json({ success: true, plans: data });
  } catch (err) {
    console.error("listPlans catch:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
