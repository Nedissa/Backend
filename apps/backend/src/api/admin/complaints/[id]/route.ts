import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const PATCH = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { status } = req.body as any

  if (!status) {
    return res.status(400).json({ error: "status krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const updated = await pgConnection("complaint")
      .where("id", id)
      .update({ status, updated_at: new Date() })
      .returning("*")

    const complaint = updated[0]

    if (!complaint) {
      return res.status(404).json({ error: "Felanmälan hittades inte" })
    }

    if (status === "resolved") {
      const customers = await pgConnection("customer")
        .select("email", "first_name")
        .where("id", complaint.customer_id)

      const customer = customers[0]

      if (customer) {
        const html = `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;"><div style="background:#000;padding:24px 32px;"><h1 style="color:#fff;margin:0;font-size:1.2rem;">Din felanmälan är löst</h1></div><div style="padding:32px;"><p style="font-size:0.95rem;color:#333;line-height:1.7;">Hej ${customer.first_name || ""},</p><p style="font-size:0.95rem;color:#333;line-height:1.7;">Vi har nu löst din felanmälan gällande order #${complaint.order_number || complaint.order_id}.</p><div style="background:#f9fafb;border-left:4px solid #000;padding:16px 20px;margin:24px 0;border-radius:4px;"><p style="margin:0;font-size:0.9rem;color:#555;">${complaint.description}</p></div><p style="font-size:0.95rem;color:#333;line-height:1.7;">Har du fler frågor? Kontakta oss på <a href="mailto:support@techpilots.se" style="color:#000;">support@techpilots.se</a>.</p></div><div style="background:#f5f5f5;padding:16px 32px;font-size:0.75rem;color:#888;">Techpilots AB &bull; support@techpilots.se &bull; +46 10 880 09 81</div></div>`

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": process.env.BREVO_API_KEY!,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: { name: "Techpilots", email: "info@techpilots.se" },
            to: [{ email: customer.email }],
            subject: "Din felanmälan är löst - Techpilots",
            htmlContent: html,
          }),
        })
      }
    }

    res.json({ complaint })
  } catch (error) {
    console.error("PATCH /admin/complaints error:", error)
    res.status(500).json({ error: "Kunde inte uppdatera felanmälan" })
  }
}
