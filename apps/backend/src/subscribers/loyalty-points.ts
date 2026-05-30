import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function loyaltyPointsHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  try {
    const orderId = data.id
    if (!orderId) return

    const orderModule = container.resolve(Modules.ORDER)
    const customerModule = container.resolve(Modules.CUSTOMER)

    const order = await orderModule.retrieveOrder(orderId, {
      select: ["id", "customer_id", "total"],
    })

    if (!order?.customer_id || !order?.total) return

    const customer = await customerModule.retrieveCustomer(order.customer_id, {
      select: ["id", "metadata"],
    })

    const metadata = (customer.metadata as any) || {}
    const existing = metadata.loyalty || {}

    const earnedPoints = Math.floor(order.total / 5000) * 2 // 2 poäng per 100 kr (total är i ören)
    const totalPoints = (existing.total_points || 0) + earnedPoints
    const lifetimeOrders = (existing.lifetime_orders || 0) + 1
    const lifetimeSpend = (existing.lifetime_spend || 0) + order.total

    const tier =
      totalPoints >= 3000 ? 'Platinum' :
      totalPoints >= 1500 ? 'Guld' :
      totalPoints >= 500 ? 'Silver' : 'Brons'

    await customerModule.updateCustomers(order.customer_id, {
      metadata: {
        ...metadata,
        loyalty: {
          ...existing,
          total_points: totalPoints,
          lifetime_orders: lifetimeOrders,
          lifetime_spend: lifetimeSpend,
          current_tier: tier,
          member_since: existing.member_since || new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    console.error("loyalty-points subscriber error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.completed",
}
