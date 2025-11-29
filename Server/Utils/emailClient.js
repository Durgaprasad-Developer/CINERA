import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {

    console.log("SENDING EMAIL → ", { to, subject });

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",   // THIS MUST BE EXACT
      to,
      subject,
      html,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return false;
    }

    console.log("EMAIL SENT → ID:", data.id);
    return true;

  } catch (err) {
    console.error("RESEND EXCEPTION:", err);
    return false;
  }
};
