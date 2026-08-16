import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productId = req.query.product_id as string
  const status = req.query.status as string

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    let query = pgConnection("product_question").select("*").orderBy("created_at", "desc")
    if (productId) {
      query = query.where("product_id", productId)
    }
    if (status) {
      query = query.where("status", status)
    }

    const questions = await query
    res.json({ questions: questions || [] })
  } catch (error) {
    console.error("GET /admin/questions error:", error)
    res.status(500).json({ error: "Failed to fetch questions" })
  }
}
