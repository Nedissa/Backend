import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerId = req.query.customer_id as string

  try {
    const customerModule = req.scope.resolve(Modules.CUSTOMER)
    const customer = await customerModule.retrieveCustomer(customerId, {
      select: ["id", "metadata"],
    })

    const complaints = (customer?.metadata?.complaints as any[]) || []
    res.json({ complaints })
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
    const customerModule = req.scope.resolve(Modules.CUSTOMER)

    const customer = await customerModule.retrieveCustomer(customer_id, {
      select: ["id", "metadata"],
    })

    const existingComplaints = (customer?.metadata?.complaints as any[]) || []

    const newComplaint = {
      id: `complaint_${Date.now()}`,
      order_id,
      description,
      status: "open",
      created_at: new Date().toISOString(),
    }

    await customerModule.updateCustomers(customer_id, {
      metadata: {
        ...customer.metadata,
        complaints: [...existingComplaints, newComplaint],
      },
    })

    res.status(201).json({ complaint: newComplaint })
  } catch (error) {
    console.error("POST /store/complaints error:", error)
    res.status(500).json({ error: "Kunde inte spara felanmälan" })
  }
}
