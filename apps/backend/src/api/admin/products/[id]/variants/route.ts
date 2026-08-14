import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { refetchEntities } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/framework/types"

// Workaround för Medusa 2.19.0-bugg: *options på variant-listan kraschar
// query-lagret ("column X.product_id does not exist", se medusajs/medusa#16452).
// Hämtar varianter utan options via standardflödet, options separat via rå SQL.
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductVariantParams>,
  res: MedusaResponse<HttpTypes.AdminProductVariantListResponse>
) => {
  const productId = req.params.id
  const requestedFields: string[] = req.queryConfig.fields ?? []
  const safeFields = requestedFields.filter(
    (f) => f !== "*options" && f !== "options" && !f.startsWith("options.")
  )

  const { data: variants, metadata } = await refetchEntities({
    entity: "variant",
    idOrFilter: { ...(req.filterableFields as any), product_id: productId },
    scope: req.scope,
    fields: safeFields,
    pagination: req.queryConfig.pagination,
  }) as any

  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
  const variantIds = variants.map((v: any) => v.id)

  const optionValueRows = variantIds.length
    ? await pgConnection("product_variant_option as pvo")
        .join("product_option_value as pov", "pov.id", "pvo.option_value_id")
        .whereIn("pvo.variant_id", variantIds)
        .select("pvo.variant_id", "pov.id", "pov.value", "pov.option_id")
    : []

  for (const variant of variants) {
    variant.options = optionValueRows
      .filter((r: any) => r.variant_id === variant.id)
      .map((r: any) => ({ id: r.id, value: r.value, option_id: r.option_id }))
  }

  res.json({
    variants,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
