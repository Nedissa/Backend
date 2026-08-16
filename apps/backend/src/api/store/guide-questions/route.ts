import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

function getClientIp(req: MedusaRequest): string {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim()
  }
  return req.socket?.remoteAddress || "unknown"
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const guideSlug = req.query.guide_slug as string

  if (!guideSlug) {
    return res.status(400).json({ error: "guide_slug krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const questions = await pgConnection("guide_question")
      .select(
        "id",
        "guide_slug",
        "customer_name",
        "question",
        "answer",
        "created_at",
        "answered_at",
        "question_likes",
        "question_dislikes",
        "answer_likes",
        "answer_dislikes"
      )
      .where("guide_slug", guideSlug)
      .where("status", "answered")
      .orderBy("answered_at", "desc")

    res.json({ questions: questions || [] })
  } catch {
    res.json({ questions: [] })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { guide_slug, customer_name, customer_email, question } = req.body as any

  if (!guide_slug || !customer_name || !customer_email || !question) {
    return res.status(400).json({ error: "guide_slug, customer_name, customer_email och question krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const ip = getClientIp(req)

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
    const recentCount = await pgConnection("guide_question")
      .where("ip_address", ip)
      .where("created_at", ">=", windowStart)
      .count("* as count")
      .first()

    if (ip !== "unknown" && Number(recentCount?.count || 0) >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: "Du har skickat för många frågor. Försök igen senare." })
    }

    const questionId = `guidequestion_${require('crypto').randomUUID().replace(/-/g, '').slice(0, 16)}`
    const now = new Date()

    await pgConnection("guide_question").insert({
      id: questionId,
      guide_slug,
      customer_name,
      customer_email,
      question,
      status: "pending",
      ip_address: ip,
      created_at: now,
      updated_at: now,
    })

    res.status(201).json({
      question: {
        id: questionId,
        guide_slug,
        customer_name,
        question,
        status: "pending",
        created_at: now,
      },
    })
  } catch {
    res.status(500).json({ error: "Kunde inte spara frågan" })
  }
}
