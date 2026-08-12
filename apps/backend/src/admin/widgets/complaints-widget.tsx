import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Select } from "@medusajs/ui"
import { useEffect, useState } from "react"

const ComplaintsWidget = ({ data }: any) => {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

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

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    setUpdating(complaintId)
    try {
      const res = await fetch(`/admin/complaints/${complaintId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const json = await res.json()
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? json.complaint : c))
        )
      }
    } catch (error) {
      console.error("Failed to update complaint status:", error)
    } finally {
      setUpdating(null)
    }
  }

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
            <div key={complaint.id} className="border border-ui-border-base rounded-lg p-3">
              <Text className="font-medium text-sm">Order: {complaint.order_number || complaint.order_id}</Text>
              <Text className="text-ui-fg-subtle text-sm mt-1">{complaint.description}</Text>
              <div className="flex items-center justify-between mt-3 gap-2">
                <Text className="text-ui-fg-muted text-xs">
                  {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('sv-SE') : 'No date'}
                </Text>
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  disabled={updating === complaint.id}
                  className="px-2 py-1 text-xs border border-ui-border-base rounded bg-ui-bg-field hover:bg-ui-bg-field-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
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
