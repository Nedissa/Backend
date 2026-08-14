import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { refetchEntity } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

// Workaround för Medusa 2.19.0-bugg: *options/*options.values kraschar
// query-lagret ("column X.product_id does not exist", se medusajs/medusa#16452).
// Hämtar produkten utan options via standardflödet, options separat via rå SQL.
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const requestedFields = req.queryConfig.fields ?? []
  const safeFields = requestedFields.filter(
    (f: string) => f !== "*options" && f !== "*options.values" && !f.startsWith("options.")
  )

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: safeFields,
  }) as any

  if (!product) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
  }

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

  const optionRows = await pgConnection("product_product_option as ppo")
    .join("product_option as po", "po.id", "ppo.product_option_id")
    .where("ppo.product_id", req.params.id)
    .whereNull("ppo.deleted_at")
    .whereNull("po.deleted_at")
    .select("po.id", "po.title", "po.metadata")

  const optionIds = optionRows.map((o: any) => o.id)
  const valueRows = optionIds.length
    ? await pgConnection("product_option_value")
        .whereIn("option_id", optionIds)
        .whereNull("deleted_at")
        .select("id", "value", "option_id")
    : []

  product.options = optionRows.map((o: any) => ({
    ...o,
    values: valueRows.filter((v: any) => v.option_id === o.id),
  }))

  res.status(200).json({ product })
}
