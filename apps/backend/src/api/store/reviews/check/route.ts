import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productId = req.query.product_id as string

  if (!productId) {
    return res.status(400).json({ has_purchased: false })
  }

  const customerId = (req as any).auth_context?.actor_id

  if (!customerId) {
    return res.json({ has_purchased: false })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const order = await pgConnection("order")
      .join("order_line_item", "order.id", "order_line_item.order_id")
      .where("order.customer_id", customerId)
      .where("order_line_item.product_id", productId)
      .select("order.id")
      .first()

    res.json({ has_purchased: !!order })
  } catch (error) {
    console.error("GET /store/reviews/check error:", error)
    res.json({ has_purchased: false })
  }
}
