import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function customerPurgeHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = data.id
  if (!customerId) return

  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

  try {
    const customers = await pgConnection("customer")
      .select("email")
      .where("id", customerId)
      .whereNotNull("deleted_at")

    const email = customers[0]?.email
    if (!email) return

    const providerIdentities = await pgConnection("provider_identity")
      .select("auth_identity_id")
      .where("entity_id", email)

    const authIdentityIds = providerIdentities.map((p) => p.auth_identity_id)

    await pgConnection("provider_identity").where("entity_id", email).delete()
    if (authIdentityIds.length > 0) {
      await pgConnection("auth_identity").whereIn("id", authIdentityIds).delete()
    }
    await pgConnection("customer").where("id", customerId).delete()
  } catch (err) {
    console.error("[customer-purge] Failed to hard-delete customer:", err)
  }
}

export const config: SubscriberConfig = {
  event: "customer.deleted",
}
