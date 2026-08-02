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

    const collections = await paymentModule.listPaymentCollections(
      { order_id: orderId } as any,
      { relations: ["payments"] }
    )

    for (const collection of collections) {
      for (const payment of (collection as any).payments ?? []) {
        if (payment.captured_at) continue
        await paymentModule.capturePayment({ payment_id: payment.id })
      }
    }
  } catch (err) {
    console.error("[fulfillment-capture] fel vid capture:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
