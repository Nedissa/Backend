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

        await fetch("https://api.brevo.com/v3/smtp/email", {
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
        })
      }
    }

    res.json({ complaint })
  } catch (error) {
    console.error("PATCH /admin/complaints error:", error)
    res.status(500).json({ error: "Kunde inte uppdatera felanmälan" })
  }
}
