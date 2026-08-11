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
        const resolvedDate = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })

        await Promise.allSettled([
          fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "api-key": process.env.BREVO_API_KEY!,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              to: [{ email: customer.email }],
              templateId: 4,
              params: {
                firstName: customer.first_name || "",
                caseNumber: complaint.id,
                resolution: "Åtgärdad",
                resolvedDate,
                message: complaint.description || "",
              },
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
                  properties: {
                    firstName: customer.first_name || "",
                    caseNumber: complaint.id,
                    resolution: "Åtgärdad",
                    resolvedDate,
                    message: complaint.description || "",
                  },
                  metric: { data: { type: "metric", attributes: { name: "Claim Resolved" } } },
                  profile: { data: { type: "profile", attributes: { email: customer.email } } },
                },
              },
            }),
          }),
        ])
      }
    }

    res.json({ complaint })
  } catch (error) {
    console.error("PATCH /admin/complaints error:", error)
    res.status(500).json({ error: "Kunde inte uppdatera felanmälan" })
  }
}
