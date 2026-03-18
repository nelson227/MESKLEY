import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  await transporter.sendMail({
    from: `"MESKLEY LOCATION" <${process.env.EMAIL_FROM || "contact@meskley-location.com"}>`,
    to,
    subject,
    html,
  });
}

export function rentalConfirmationEmail(name: string, dossierId: string): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #1A1A1A; padding: 30px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">MESKLEY LOCATION</h1>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1A1A1A;">Demande de location enregistrée</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Nous avons bien reçu votre demande de location. Votre numéro de dossier est :</p>
        <div style="background: #F9F9F9; border-left: 4px solid #D4AF37; padding: 20px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; color: #D4AF37; margin: 0;">${dossierId}</p>
        </div>
        <p>Notre équipe examinera votre dossier et reviendra vers vous dans les <strong>48 heures</strong>.</p>
        <p>Cordialement,<br><strong>L'équipe MESKLEY LOCATION</strong></p>
      </div>
      <div style="background: #1A1A1A; padding: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 MESKLEY LOCATION — Tous droits réservés</p>
      </div>
    </div>
  `;
}

export function candidatureConfirmationEmail(name: string, referenceId: string): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #1A1A1A; padding: 30px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">MESKLEY LOCATION</h1>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1A1A1A;">Candidature enregistrée</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Nous avons bien reçu votre candidature. Votre référence est :</p>
        <div style="background: #F9F9F9; border-left: 4px solid #D4AF37; padding: 20px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; color: #D4AF37; margin: 0;">${referenceId}</p>
        </div>
        <p>Nous vous contacterons prochainement.</p>
        <p>Cordialement,<br><strong>L'équipe MESKLEY LOCATION</strong></p>
      </div>
      <div style="background: #1A1A1A; padding: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 MESKLEY LOCATION — Tous droits réservés</p>
      </div>
    </div>
  `;
}

export function adminNotificationEmail(type: string, details: string): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #1A1A1A; padding: 30px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">MESKLEY LOCATION — Admin</h1>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1A1A1A;">Nouvelle notification : ${type}</h2>
        <div style="background: #F9F9F9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          ${details}
        </div>
        <p>Connectez-vous au back-office pour gérer cette notification.</p>
      </div>
      <div style="background: #1A1A1A; padding: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 MESKLEY LOCATION — Tous droits réservés</p>
      </div>
    </div>
  `;
}
