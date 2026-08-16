import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const VALID_TARGETS = ["question", "answer"]
const VALID_VOTES = ["like", "dislike"]

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { target, vote } = req.body as any

  if (!VALID_TARGETS.includes(target) || !VALID_VOTES.includes(vote)) {
    return res.status(400).json({ error: "target måste vara question/answer och vote like/dislike" })
  }

  const column = `${target}_${vote}s`

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const updated = await pgConnection("product_question")
      .where("id", id)
      .increment(column, 1)
      .returning([
        "id",
        "question_likes",
        "question_dislikes",
        "answer_likes",
        "answer_dislikes",
      ])

    const question = updated[0]

    if (!question) {
      return res.status(404).json({ error: "Frågan hittades inte" })
    }

    res.json({ question })
  } catch (error) {
    console.error("POST /store/questions/:id/vote error:", error)
    res.status(500).json({ error: "Kunde inte registrera rösten" })
  }
}
