import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function passwordResetHandler({
  event: { data },
}: SubscriberArgs<any>) {
  const email = data?.email || data?.identifier || data?.entity_id
  const token = data?.token
  const url = data?.url

  const resetUrl = url || `${process.env.STORE_URL || "https://techpilots.vercel.app"}/aterstall-losenord?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="background:#000;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:1.2rem;">Återställ ditt lösenord</h1>
      </div>
      <div style="padding:32px;">
        <p style="font-size:0.95rem;color:#333;line-height:1.7;">Hej,</p>
        <p style="font-size:0.95rem;color:#333;line-height:1.7;">Vi fick en begäran om att återställa lösenordet för ditt konto på Techpilots. Klicka på knappen nedan för att välja ett nytt lösenord.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-weight:700;font-size:0.95rem;border-radius:4px;">Återställ lösenord</a>
        </div>
        <p style="font-size:0.85rem;color:#888;line-height:1.7;">Länken är giltig i 24 timmar. Om du inte begärde detta kan du ignorera detta mail.</p>
      </div>
      <div style="background:#f5f5f5;padding:16px 32px;font-size:0.75rem;color:#888;">
        Techpilots AB &bull; support@techpilots.se &bull; +46 10 880 09 81
      </div>
    </div>
  `

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Techpilots", email: "info@techpilots.se" },
      to: [{ email }],
      subject: "Återställ ditt lösenord - Techpilots",
      htmlContent: html,
    }),
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
