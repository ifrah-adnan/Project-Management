import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
}
