/**
 * lib/email.ts - Transactional email utility
 * Supports: Resend (recommended), SMTP via nodemailer (if installed), console fallback
 * Configure via env: RESEND_API_KEY or SMTP_HOST+SMTP_USER+SMTP_PASS
 */

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

const FROM = process.env.EMAIL_FROM || "NOVA Marketplace <noreply@nova.ci>";

// ── Resend (https://resend.com) ──────────────────────────────────────────────
async function sendViaResend(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:     payload.from || FROM,
      to:       Array.isArray(payload.to) ? payload.to : [payload.to],
      subject:  payload.subject,
      html:     payload.html,
      reply_to: payload.replyTo,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[EMAIL Resend] Error:", err);
    return false;
  }
  return true;
}

// ── Console fallback (development / unconfigured) ───────────────────────────
function sendViaConsole(payload: EmailPayload): boolean {
  console.log("[EMAIL] ==== OUTGOING EMAIL (no provider configured) ====");
  console.log("[EMAIL] To:     ", payload.to);
  console.log("[EMAIL] Subject:", payload.subject);
  console.log("[EMAIL] HTML:   ", payload.html.replace(/<[^>]+>/g, "").slice(0, 200) + "...");
  console.log("[EMAIL] =======================================================");
  return true;
}

// ── Main send function ───────────────────────────────────────────────────────
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      return await sendViaResend(payload);
    }
    // Fallback: log to console (development mode)
    return sendViaConsole(payload);
  } catch (e) {
    console.error("[EMAIL] Unexpected error:", e);
    return false;
  }
}

// ── Typed email helpers ──────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Bienvenue sur NOVA Marketplace !",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#F97316;margin-bottom:8px">Bienvenue, ${name} !</h1>
        <p style="color:#374151">Votre compte NOVA Marketplace est cree. Vous pouvez maintenant publier vos annonces automobile et immobilier.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#F97316;color:white;border-radius:8px;text-decoration:none;font-weight:600">Acceder a mon espace</a>
        <p style="margin-top:32px;color:#9CA3AF;font-size:14px">L'equipe NOVA Marketplace</p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmationEmail(to: string, name: string, planLabel: string, amount: number, reference: string) {
  return sendEmail({
    to,
    subject: `Confirmation de paiement - ${planLabel}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#10B981;margin-bottom:8px">Paiement confirme !</h1>
        <p style="color:#374151">Bonjour ${name},</p>
        <p style="color:#374151">Votre paiement pour le plan <strong>${planLabel}</strong> a ete traite avec succes.</p>
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0;color:#374151"><strong>Montant :</strong> ${amount.toLocaleString("fr-FR")} FCFA</p>
          <p style="margin:8px 0 0;color:#374151"><strong>Reference :</strong> ${reference}</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/factures" style="display:inline-block;padding:12px 24px;background:#F97316;color:white;border-radius:8px;text-decoration:none;font-weight:600">Voir ma facture</a>
        <p style="margin-top:32px;color:#9CA3AF;font-size:14px">L'equipe NOVA Marketplace</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: "Reinitialisation de votre mot de passe",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#F97316;margin-bottom:8px">Reinitialisation du mot de passe</h1>
        <p style="color:#374151">Cliquez sur le bouton ci-dessous pour reinitialiser votre mot de passe. Ce lien est valable 1 heure.</p>
        <a href="${resetLink}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#F97316;color:white;border-radius:8px;text-decoration:none;font-weight:600">Reinitialiser mon mot de passe</a>
        <p style="margin-top:24px;color:#6B7280;font-size:14px">Si vous n'avez pas demande cette reinitialisation, ignorez cet email.</p>
      </div>
    `,
  });
}

export async function sendNewLeadNotification(to: string, leadName: string, leadEmail: string, leadMessage: string) {
  return sendEmail({
    to,
    subject: `Nouveau lead : ${leadName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#F97316;margin-bottom:8px">Nouveau lead recu</h1>
        <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;color:#374151"><strong>Nom :</strong> ${leadName}</p>
          <p style="margin:8px 0 0;color:#374151"><strong>Email :</strong> ${leadEmail}</p>
          <p style="margin:8px 0 0;color:#374151"><strong>Message :</strong> ${leadMessage}</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/admin/(panel)/leads" style="display:inline-block;padding:12px 24px;background:#F97316;color:white;border-radius:8px;text-decoration:none;font-weight:600">Voir dans le CRM</a>
      </div>
    `,
  });
}
