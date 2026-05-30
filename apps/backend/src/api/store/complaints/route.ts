import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerId = req.query.customer_id as string

  if (!customerId) {
    return res.json({ complaints: [] })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const complaints = await pgConnection("complaint")
      .select("*")
      .where("customer_id", customerId)
      .orderBy("created_at", "desc")

    res.json({ complaints: complaints || [] })
  } catch (error) {
    console.error("GET /store/complaints error:", error)
    res.json({ complaints: [] })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { customer_id, order_id, description } = req.body as any

  if (!customer_id || !order_id || !description) {
    return res.status(400).json({
      error: "customer_id, order_id och description krävs",
    })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const complaintId = `complaint_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()

    await pgConnection("complaint").insert({
      id: complaintId,
      customer_id,
      order_id,
      description,
      status: "open",
      created_at: now,
      updated_at: now,
    })

    res.status(201).json({
      complaint: {
        id: complaintId,
        customer_id,
        order_id,
        description,
        status: "open",
        created_at: now,
        updated_at: now,
      },
    })
  } catch (error) {
    console.error("POST /store/complaints error:", error)
    res.status(500).json({ error: "Kunde inte spara felanmälan" })
  }
}
