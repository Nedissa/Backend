import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const { tracking_number } = req.body as { tracking_number?: string }
    const customerId = (req as any).auth_context?.actor_id

    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    if (!tracking_number || !tracking_number.trim()) {
      return res.status(400).json({ error: "tracking_number is required" })
    }

    const orderModuleService = req.scope.resolve(Modules.ORDER)

    const order = await orderModuleService.retrieveOrder(id, {
      select: ["id", "customer_id", "metadata"],
    })

    if (order.customer_id !== customerId) {
      return res.status(403).json({ error: "Not authorized for this order" })
    }

    const updated = await orderModuleService.updateOrders({
      id,
      metadata: {
        ...(order.metadata || {}),
        return_tracking_number: tracking_number.trim(),
      },
    })

    return res.json({ order: updated })
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
    logger.error(`POST /store/orders/[id]/return-tracking error: ${error}`)
    return res.status(500).json({ error: "Failed to save return tracking number" })
  }
}
