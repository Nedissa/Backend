import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function fulfillmentCaptureHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  try {
    const orderId = data.order_id
    if (!orderId) return

    const paymentModule = container.resolve(Modules.PAYMENT)
    const orderModule = container.resolve(Modules.ORDER)

    const order = await orderModule.retrieveOrder(orderId, {
      select: ["id", "payment_collections"],
      relations: ["payment_collections", "payment_collections.payments"],
    })

    const payments = order.payment_collections?.flatMap((pc: any) => pc.payments ?? []) ?? []

    for (const payment of payments) {
      if (payment.captured_at) continue
      await paymentModule.capturePayment({ payment_id: payment.id })
    }
  } catch (err) {
    console.error("[fulfillment-capture] fel vid capture:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
