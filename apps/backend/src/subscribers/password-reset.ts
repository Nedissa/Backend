import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function passwordResetHandler({
  event: { data },
}: SubscriberArgs<any>) {
  const email = data?.email || data?.identifier || data?.entity_id
  const token = data?.token
  if (!email || !token) return

  const resetUrl = `${process.env.STORE_URL || "https://techpilots.vercel.app"}/aterstall-losenord?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

  await Promise.allSettled([
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to: [{ email }],
        templateId: 2,
        params: { resetUrl },
      }),
    }),
    fetch("https://a.klaviyo.com/api/events", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY!}`,
        "content-type": "application/json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            properties: { resetUrl },
            metric: { data: { type: "metric", attributes: { name: "Password Reset Requested" } } },
            profile: { data: { type: "profile", attributes: { email } } },
          },
        },
      }),
    }),
  ])
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
