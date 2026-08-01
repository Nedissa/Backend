import { MedusaContainer } from "@medusajs/framework"

export default async function fixInventory({ container }: { container: MedusaContainer }) {
  const productModule = container.resolve("product")
  
  const variants = await productModule.listProductVariants({
    id: [
      "variant_01KV0B4YER5SD102SMFZ99D5RM",
      "variant_01KV0AP3QZW2TMDNH9Q43JNW68",
      "variant_01KV0BKJ8T2V7BFF88NVVY6SFG",
      "variant_01KV0BMWT27XHA5RMVY7NF14SZ",
    ]
  })
  
  for (const v of variants) {
    await productModule.updateProductVariants(v.id, { manage_inventory: false })
    console.log("Updated:", v.id)
  }
}
