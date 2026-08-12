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

    const klaviyoHeaders = {
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY!}`,
      "content-type": "application/json",
      revision: "2024-10-15",
    }

    await Promise.allSettled([
      // Orderbekräftelse till kund via Brevo mall 1
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": process.env.BREVO_API_KEY!, "content-type": "application/json" },
        body: JSON.stringify({
          to: [{ email: order.email }],
          templateId: 1,
          params,
        }),
      }),
      // Intern ordernotis via Brevo
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": process.env.BREVO_API_KEY!, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "Techpilots Order", email: "info@techpilots.se" },
          to: [{ email: "order@techpilots.se" }],
          subject: `Ny order ${orderNumber} – ${totalStr}`,
          htmlContent: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;font-family:sans-serif;background:#f5f5f5;"><div style="max-width:480px;background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e5e5;"><h2 style="margin:0 0 16px;font-size:1rem;color:#111;">Ny order ${orderNumber}</h2><p style="margin:0 0 6px;font-size:0.875rem;color:#555;"><strong>Kund:</strong> ${address?.first_name || ""} ${address?.last_name || ""} &lt;${order.email}&gt;</p><p style="margin:0 0 6px;font-size:0.875rem;color:#555;"><strong>Produkter:</strong> ${itemList}</p><p style="margin:0 0 6px;font-size:0.875rem;color:#555;"><strong>Totalt:</strong> ${totalStr}</p><p style="margin:0 0 6px;font-size:0.875rem;color:#555;"><strong>Leveranssätt:</strong> ${shippingName}</p>${address ? `<p style="margin:0;font-size:0.875rem;color:#555;"><strong>Adress:</strong> ${address.address_1}, ${address.postal_code} ${address.city}</p>` : ""}</div></body></html>`,
        }),
      }),
      // Orderdata till Klaviyo för marketing-automation
      fetch("https://a.klaviyo.com/api/events", {
        method: "POST",
        headers: klaviyoHeaders,
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
    ])
  } catch (err) {
    console.error("[order-placed] Failed to send confirmation email:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
