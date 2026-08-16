import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const PATCH = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { answer } = req.body as any

  if (!answer) {
    return res.status(400).json({ error: "answer krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const updated = await pgConnection("guide_question")
      .where("id", id)
      .update({
        answer,
        status: "answered",
        answered_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*")

    const question = updated[0]

    if (!question) {
      return res.status(404).json({ error: "Frågan hittades inte" })
    }

    res.json({ question })
  } catch (error) {
    console.error("PATCH /admin/guide-questions error:", error)
    res.status(500).json({ error: "Kunde inte spara svaret" })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    await pgConnection("guide_question").where("id", id).delete()
    res.status(200).json({ id, deleted: true })
  } catch (error) {
    console.error("DELETE /admin/guide-questions error:", error)
    res.status(500).json({ error: "Kunde inte ta bort frågan" })
  }
}
