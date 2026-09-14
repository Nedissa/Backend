import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Endast den inloggade kundens eget id används — aldrig ett värde från query,
  // annars kan vem som helst läsa en annan kunds klagomålshistorik (IDOR).
  const customerId = (req as any).auth_context?.actor_id as string | undefined

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
  // customer_id kommer alltid från den inloggade sessionen, aldrig från request body,
  // annars kan vem som helst skapa ett klagomål i en annan kunds namn.
  const customerId = (req as any).auth_context?.actor_id as string | undefined
  const { order_id, description } = req.body as any

  if (!customerId) {
    return res.status(401).json({ error: "Inloggning krävs" })
  }

  if (!order_id || !description) {
    return res.status(400).json({
      error: "order_id och description krävs",
    })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const complaintId = `complaint_${require('crypto').randomUUID().replace(/-/g, '').slice(0, 16)}`
    const now = new Date()

    await pgConnection("complaint").insert({
      id: complaintId,
      customer_id: customerId,
      order_id,
      description,
      status: "open",
      created_at: now,
      updated_at: now,
    })

    res.status(201).json({
      complaint: {
        id: complaintId,
        customer_id: customerId,
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
