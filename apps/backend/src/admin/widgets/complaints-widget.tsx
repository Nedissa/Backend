import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

const ComplaintsWidget = ({ data }: any) => {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!data?.id) return

    fetch(`/admin/complaints?customer_id=${data.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setComplaints(json.complaints || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [data?.id])

  return (
    <Container>
      <Heading level="h2">Issue Reports</Heading>

      {loading ? (
        <Text className="text-ui-fg-subtle mt-2">Loading...</Text>
      ) : complaints.length === 0 ? (
        <Text className="text-ui-fg-subtle mt-2">No issue reports registered for this customer.</Text>
      ) : (
        <div className="mt-4 space-y-4">
          {complaints.map((complaint: any) => (
            <div key={complaint.id} className="border-b border-ui-border-base pb-3 last:border-b-0">
              <Text className="font-medium text-sm">Order: {complaint.order_number || complaint.order_id}</Text>
              <Text className="text-ui-fg-subtle text-sm mt-1">{complaint.description}</Text>
              <Text className="text-ui-fg-muted text-xs mt-1">
                Status: {complaint.status} · {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-SE') : 'No date'}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default ComplaintsWidget
