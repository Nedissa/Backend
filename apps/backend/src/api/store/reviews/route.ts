import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productId = req.query.product_id as string

  if (!productId) {
    return res.status(400).json({ error: "product_id krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const reviews = await pgConnection("product_review")
      .select("*")
      .where("product_id", productId)
      .orderBy("created_at", "desc")

    res.json({ reviews: reviews || [] })
  } catch {
    res.json({ reviews: [] })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { product_id, customer_id, customer_name, rating, comment } = req.body as any

  if (!product_id || !customer_id || !customer_name || !rating) {
    return res.status(400).json({ error: "product_id, customer_id, customer_name och rating krävs" })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating måste vara mellan 1 och 5" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    // Check if customer already reviewed this product
    const existing = await pgConnection("product_review")
      .where("product_id", product_id)
      .where("customer_id", customer_id)
      .first()

    if (existing) {
      return res.status(400).json({ error: "Du har redan recenserat denna produkt" })
    }

    // Check if customer has bought this product (verified purchase)
    let verifiedPurchase = false
    try {
      const orders = await pgConnection("order")
        .join("order_item", "order.id", "order_item.order_id")
        .where("order.customer_id", customer_id)
        .where("order_item.product_id", product_id)
        .select("order.id")
        .first()
      verifiedPurchase = !!orders
    } catch {
      // verified_purchase stays false if check fails
    }

    const reviewId = `review_${require('crypto').randomUUID().replace(/-/g, '').slice(0, 16)}`
    const now = new Date()

    await pgConnection("product_review").insert({
      id: reviewId,
      product_id,
      customer_id,
      customer_name,
      rating: parseInt(rating),
      comment: comment || null,
      verified_purchase: verifiedPurchase,
      created_at: now,
      updated_at: now,
    })

    res.status(201).json({
      review: {
        id: reviewId,
        product_id,
        customer_id,
        customer_name,
        rating: parseInt(rating),
        comment,
        verified_purchase: verifiedPurchase,
        created_at: now,
      },
    })
  } catch {
    res.status(500).json({ error: "Kunde inte spara recensionen" })
  }
}
