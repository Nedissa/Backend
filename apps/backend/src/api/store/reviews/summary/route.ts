import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const rows = await pgConnection("product_review")
      .select("product_id")
      .avg("rating as avg")
      .count("* as count")
      .groupBy("product_id")
    const ratings: Record<string, { avg: number; count: number }> = {}
    for (const row of rows) {
      ratings[row.product_id as string] = {
        avg: parseFloat(row.avg as string),
        count: parseInt(row.count as string),
      }
    }
    res.json({ ratings })
  } catch {
    res.json({ ratings: {} })
  }
}
