import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { DataSource } from "typeorm"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { customer_id } = req.query

    if (!customer_id) {
      return res.status(400).json({
        error: "customer_id is required",
      })
    }

    const dataSource = req.scope.resolve<DataSource>(
      ContainerRegistrationKeys.DATA_SOURCE
    )

    const complaints = await dataSource.query(
      `SELECT * FROM complaint WHERE customer_id = $1 ORDER BY created_at DESC`,
      [customer_id]
    )

    return res.json({ complaints })
  } catch (error) {
    console.error("GET /admin/complaints error:", error)
    return res.status(500).json({
      error: "Failed to fetch complaints",
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { customer_id, order_id, description } = req.body

    if (!customer_id || !order_id || !description) {
      return res.status(400).json({
        error: "customer_id, order_id, and description are required",
      })
    }

    const dataSource = req.scope.resolve<DataSource>(
      ContainerRegistrationKeys.DATA_SOURCE
    )

    const complaintId = `complaint_${Math.random().toString(36).substr(2, 9)}`

    // Get order number from orders table
    const order = await dataSource.query(
      `SELECT display_id FROM "order" WHERE id = $1`,
      [order_id]
    )

    const orderNumber = order[0]?.display_id || order_id

    const complaint = await dataSource.query(
      `INSERT INTO complaint (id, customer_id, order_id, order_number, description, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [
        complaintId,
        customer_id,
        order_id,
        orderNumber,
        description,
        "open",
      ]
    )

    return res.status(201).json({
      complaint: complaint[0],
    })
  } catch (error) {
    console.error("POST /admin/complaints error:", error)
    return res.status(500).json({
      error: "Failed to save complaint",
    })
  }
}
