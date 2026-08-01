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
        "currency_code", "created_at",
      ],
      relations: ["items", "shipping_address", "shipping_methods", "payment_collections"],
    })

    if (!order?.email) return

    const formatPrice = (amount: number | string | bigint | null | undefined) =>
      new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0 }).format(Number(amount) / 100)

    const orderNumber = `TP-${String(order.display_id).padStart(5, "0")}`
    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s
    const orderDate = new Date(order.created_at).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })
    const shippingName = (order.shipping_methods || [])[0]?.name || null
    const paymentProvider = ((order as any).payment_collections || [])[0]?.payments?.[0]?.provider_id || null
    const paymentLabel = paymentProvider
      ? paymentProvider.replace("pp_stripe_", "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      : null

    const itemRows = (order.items || []).map((item: any) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f3f3f3;font-size:0.875rem;color:#111;">${capitalize(item.title)}</td>
        <td style="padding:14px 0;border-bottom:1px solid #f3f3f3;font-size:0.875rem;color:#666;text-align:center;">${item.quantity}</td>
        <td style="padding:14px 0;border-bottom:1px solid #f3f3f3;font-size:0.875rem;color:#111;text-align:right;font-weight:500;">${formatPrice(item.unit_price * item.quantity)}</td>
      </tr>
    `).join("")

    const address = order.shipping_address

    const metaRow = [
      shippingName ? `<td style="vertical-align:top;padding-right:24px;"><p style="margin:0 0 5px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:#999;font-weight:600;">Leveranss&auml;tt</p><p style="margin:0;font-size:0.875rem;color:#111;">${shippingName}</p></td>` : "",
      paymentLabel ? `<td style="vertical-align:top;"><p style="margin:0 0 5px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:#999;font-weight:600;">Betal s&auml;tt</p><p style="margin:0;font-size:0.875rem;color:#111;">${paymentLabel}</p></td>` : "",
    ].filter(Boolean).join("")

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <tr><td style="background:#000;padding:24px 32px;">
          <span style="color:#fff;font-size:1.1rem;font-weight:800;letter-spacing:-0.3px;">Techpilots</span>
        </td></tr>
        <tr><td style="padding:32px;">
          <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding-right:12px;vertical-align:middle;">
                <div style="width:36px;height:36px;background:#f0fdf4;border-radius:50%;text-align:center;line-height:36px;font-size:1.1rem;">&#10003;</div>
              </td>
              <td style="vertical-align:middle;">
                <h1 style="margin:0;font-size:1.15rem;font-weight:700;color:#111;">Din order &auml;r p&aring; v&auml;g!</h1>
                <p style="margin:2px 0 0;font-size:0.85rem;color:#888;">En bekr&auml;ftelse har skickats till ${order.email}</p>
              </td>
            </tr>
          </table>
          <div style="background:#f9f9f9;border-radius:6px;padding:14px 18px;margin-bottom:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:0.7rem;color:#999;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:3px;">Ordernummer</span>
                  <span style="font-size:0.95rem;font-weight:700;color:#111;">${orderNumber}</span>
                </td>
                <td align="right">
                  <span style="font-size:0.7rem;color:#999;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:3px;">Datum</span>
                  <span style="font-size:0.875rem;color:#111;">${orderDate}</span>
                </td>
              </tr>
            </table>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <thead>
              <tr>
                <th style="padding:0 0 10px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:#999;text-align:left;font-weight:600;">Produkt</th>
                <th style="padding:0 0 10px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:#999;text-align:center;font-weight:600;">Antal</th>
                <th style="padding:0 0 10px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:#999;text-align:right;font-weight:600;">Pris</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="padding:6px 0;font-size:0.875rem;color:#666;">Delsumma</td>
              <td style="padding:6px 0;font-size:0.875rem;color:#111;text-align:right;">${formatPrice(order.subtotal as any ?? 0)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:0.875rem;color:#666;">Frakt</td>
              <td style="padding:6px 0;font-size:0.875rem;color:#111;text-align:right;">${order.shipping_total ? formatPrice(order.shipping_total as any) : "Gratis"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0;font-size:0.95rem;font-weight:700;color:#111;border-top:2px solid #111;">Totalt</td>
              <td style="padding:12px 0 0;font-size:0.95rem;font-weight:700;color:#111;text-align:right;border-top:2px solid #111;">${formatPrice(order.total as any ?? 0)}</td>
            </tr>
          </table>
          ${metaRow ? `<table cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr>${metaRow}</tr></table>` : ""}
          ${address ? `
          <div style="margin-bottom:28px;">
            <p style="margin:0 0 8px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:#999;font-weight:600;">Leveransadress</p>
            <p style="margin:0;font-size:0.875rem;color:#111;line-height:1.7;">
              ${address.first_name} ${address.last_name}<br>
              ${address.address_1}${address.address_2 ? ", " + address.address_2 : ""}<br>
              ${address.postal_code} ${address.city}
            </p>
          </div>
          ` : ""}
          <a href="https://techpilots.vercel.app/konto" style="display:block;background:#111;color:#fff;text-align:center;padding:14px 24px;text-decoration:none;font-weight:600;font-size:0.875rem;border-radius:6px;">Se din order</a>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #f0f0f0;">
          <p style="margin:0;font-size:0.75rem;color:#aaa;line-height:1.6;">
            Techpilots &bull; <a href="mailto:support@techpilots.se" style="color:#aaa;">support@techpilots.se</a><br>
            Du f&aring;r detta mail f&ouml;r att du lagt en order hos oss.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Techpilots", email: "info@techpilots.se" },
        to: [{ email: order.email }],
        subject: `Orderbekräftelse ${orderNumber} – Techpilots`,
        htmlContent: html,
      }),
    })
  } catch (err) {
    console.error("[order-placed] Failed to send confirmation email:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
