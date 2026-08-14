import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/framework/types"

// Workaround för Medusa 2.19.0-bugg: ProductOption.products (many-to-many)
// kraschar query-lagret ("column X.product_id does not exist", se medusajs/medusa#16452).
// Hämtar options via rå SQL istället för refetchEntities.
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductOptionParams>,
  res: MedusaResponse<HttpTypes.AdminProductOptionListResponse>
) => {
  const productId = req.params.id
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

  const optionRows = await pgConnection("product_product_option as ppo")
    .join("product_option as po", "po.id", "ppo.product_option_id")
    .where("ppo.product_id", productId)
    .whereNull("ppo.deleted_at")
    .whereNull("po.deleted_at")
    .select("po.id", "po.title", "po.metadata", "po.created_at", "po.updated_at")

  const optionIds = optionRows.map((o: any) => o.id)
  const valueRows = optionIds.length
    ? await pgConnection("product_option_value")
        .whereIn("option_id", optionIds)
        .whereNull("deleted_at")
        .select("id", "value", "option_id", "created_at", "updated_at")
    : []

  const product_options = optionRows.map((o: any) => ({
    ...o,
    values: valueRows.filter((v: any) => v.option_id === o.id),
  }))

  res.json({
    product_options: product_options as any,
    count: product_options.length,
    offset: 0,
    limit: product_options.length,
  })
}
