import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  try {
    const orderId = data.id
    if (!orderId) return

    const orderModule = container.resolve(Modules.ORDER)

    const order = await orderModule.retrieveOrder(orderId, {
      select: [
        "id", "display_id", "email", "total", "subtotal", "shipping_total",
        "tax_total", "currency_code", "created_at",
      ],
      relations: ["items", "shipping_address", "shipping_methods"],
    })

    if (!order?.email) return

    const formatPrice = (amount: number | string | bigint | null | undefined) =>
      new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0 }).format(Number(amount) / 100)

    const orderNumber = `TP-${String(order.display_id).padStart(5, "0")}`
    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s
    const orderDate = new Date(order.created_at).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })
    const address = order.shipping_address
    const shippingName = (order.shipping_methods || [])[0]?.name || "Standard"

    const items = (order.items || []).map((item: any) => ({
      title: capitalize(item.title),
      quantity: item.quantity,
      price: formatPrice(item.unit_price * item.quantity),
      image: item.thumbnail || "",
    }))

    const params = {
      firstName: address?.first_name || "",
      lastName: address?.last_name || "",
      orderNumber,
      orderDate,
      items,
      subtotal: formatPrice(order.subtotal as any ?? 0),
      shipping: order.shipping_total ? formatPrice(order.shipping_total as any) : "Gratis",
      vat: formatPrice((order.tax_total as any) ?? 0),
      total: formatPrice(order.total as any ?? 0),
      shippingMethod: shippingName,
      estimatedDelivery: "2–5 arbetsdagar",
      paymentMethod: "Kort",
      addressLine1: address?.address_1 || "",
      postalCode: address?.postal_code || "",
      city: address?.city || "",
    }

    const totalStr = formatPrice(order.total as any ?? 0)
    const itemList = items.map((i) => `${i.title} x${i.quantity}`).join(", ")

    await Promise.allSettled([
      // Orderbekräftelse till kund via Klaviyo event "Order Placed" (triggar Flow)
      fetch("https://a.klaviyo.com/api/events", {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY!}`,
          "content-type": "application/json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "event",
            attributes: {
              properties: params,
              metric: { data: { type: "metric", attributes: { name: "Order Placed" } } },
              profile: { data: { type: "profile", attributes: { email: order.email } } },
            },
          },
        }),
      }),
      // Intern ordernotis via Klaviyo event
      fetch("https://a.klaviyo.com/api/events", {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY!}`,
          "content-type": "application/json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "event",
            attributes: {
              properties: {
                orderNumber,
                customerName: `${address?.first_name || ""} ${address?.last_name || ""}`.trim(),
                customerEmail: order.email,
                itemList,
                total: totalStr,
                shippingMethod: shippingName,
                address: address ? `${address.address_1}, ${address.postal_code} ${address.city}` : "",
              },
              metric: { data: { type: "metric", attributes: { name: "Order Placed Internal" } } },
              profile: { data: { type: "profile", attributes: { email: "order@techpilots.se" } } },
            },
          },
        }),
      }),
    ])
  } catch (err) {
    console.error("[order-placed] Failed to send confirmation email:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
