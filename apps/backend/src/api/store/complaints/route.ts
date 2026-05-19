import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerId = req.query.customer_id as string

  try {
    const db = req.scope.resolve("db") as any
    const complaints = await db.query.from("complaint").select(["*"]).where("customer_id", "=", customerId)

    res.json({
      complaints: complaints || [],
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch complaints",
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { customer_id, order_id, description } = req.body as any

  if (!customer_id || !order_id || !description) {
    return res.status(400).json({
      error: "customer_id, order_id, and description are required",
    })
  }

  try {
    const db = req.scope.resolve("db") as any

    // Get order number from orders table
    const orders = await db.query.from("order").select(["display_id"]).where("id", "=", order_id)
    const orderNumber = orders[0]?.display_id || order_id

    const complaintId = `complaint_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()

    // Insert complaint
    const result = await db.query.from("complaint").insert({
      id: complaintId,
      customer_id,
      order_id,
      order_number: orderNumber,
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
        order_number: orderNumber,
        description,
        status: "open",
        created_at: now,
        updated_at: now,
      },
    })
  } catch (error) {
    console.error("POST /store/complaints error:", error)
    res.status(500).json({
      error: "Failed to save complaint",
    })
  }
}
