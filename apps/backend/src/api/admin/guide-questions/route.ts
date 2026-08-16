import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const guideSlug = req.query.guide_slug as string
  const status = req.query.status as string

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    let query = pgConnection("guide_question").select("*").orderBy("created_at", "desc")
    if (guideSlug) {
      query = query.where("guide_slug", guideSlug)
    }
    if (status) {
      query = query.where("status", status)
    }

    const questions = await query
    res.json({ questions: questions || [] })
  } catch (error) {
    console.error("GET /admin/guide-questions error:", error)
    res.status(500).json({ error: "Failed to fetch questions" })
  }
}
