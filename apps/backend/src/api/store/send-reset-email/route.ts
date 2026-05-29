import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import nodemailer from "nodemailer"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email, token } = req.body as any

  if (!email || !token) {
    return res.status(400).json({ error: "email och token krävs" })
  }

  const storeUrl = process.env.STORE_URL || "https://techpilots.vercel.app"
  const resetUrl = `${storeUrl}/aterstall-losenord?token=${token}&email=${encodeURIComponent(email)}`

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.strato.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Techpilots" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Återställ ditt lösenord",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Techpilots</h1>
          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 32px;" />
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Återställ ditt lösenord</h2>
          <p style="color: #555; margin-bottom: 24px;">Vi fick en begäran om att återställa lösenordet för ditt konto. Klicka på knappen nedan för att välja ett nytt lösenord.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-bottom: 24px;">Återställ lösenord</a>
          <p style="color: #999; font-size: 13px;">Länken är giltig i 24 timmar. Om du inte begärde detta kan du ignorera mailet.</p>
          <p style="color: #999; font-size: 13px;">Om knappen inte fungerar, kopiera denna länk:<br/><a href="${resetUrl}" style="color: #000;">${resetUrl}</a></p>
        </div>
      `,
    })

    res.json({ success: true })
  } catch (error) {
    console.error("Send reset email error:", error)
    res.status(500).json({ error: "Kunde inte skicka mail" })
  }
}
