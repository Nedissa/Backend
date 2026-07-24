import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import crypto from "crypto"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({ error: "id krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const rows = await pgConnection("shared_cart")
      .select("*")
      .where("id", id)
      .where("expires_at", ">", new Date())
      .limit(1)

    if (!rows.length) {
      return res.status(404).json({ error: "Länken har gått ut eller finns inte" })
    }

    res.json({ items: rows[0].items })
  } catch (error) {
    console.error("GET /store/shared-cart error:", error)
    res.status(500).json({ error: "Kunde inte hämta delad korg" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { items } = req.body as { items: any[] }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items krävs" })
  }

  try {
    const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const id = crypto.randomBytes(3).toString("hex")
    const now = new Date()
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dagar

    await pgConnection("shared_cart").insert({
      id,
      items: JSON.stringify(items),
      created_at: now,
      expires_at: expires,
    })

    res.status(201).json({ id })
  } catch (error) {
    console.error("POST /store/shared-cart error:", error)
    res.status(500).json({ error: "Kunde inte spara delad korg" })
  }
}
