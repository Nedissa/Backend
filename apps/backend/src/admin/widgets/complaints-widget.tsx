import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

const ComplaintsWidget = ({ data }: any) => {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <Text className="font-medium text-sm">Order: {complaint.order_number || complaint.order_id}</Text>
                  <Text className="text-ui-fg-muted text-xs mt-1">
                    {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('sv-SE') : 'No date'}
                  </Text>
                </div>
                <div className="flex-shrink-0 relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === complaint.id ? null : complaint.id)}
                    disabled={updating === complaint.id}
                    className="px-3 py-1.5 text-xs rounded font-medium bg-ui-bg-subtle text-ui-fg-muted hover:bg-ui-bg-field disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {complaint.status?.toLowerCase() === 'open' ? 'Mark Resolved' : 'Mark Open'}
                  </button>
                  {openDropdown === complaint.id && (
                    <div className="absolute right-0 mt-1 bg-ui-bg-base border border-ui-border-base rounded shadow-lg z-10 min-w-max">
                      <button
                        onClick={() => {
                          const newStatus = complaint.status?.toLowerCase() === 'open' ? 'resolved' : 'open'
                          handleStatusChange(complaint.id, newStatus)
                          setOpenDropdown(null)
                        }}
                        className="block w-full text-left px-4 py-2 text-xs hover:bg-ui-bg-field transition-colors"
                      >
                        {complaint.status?.toLowerCase() === 'open' ? 'Resolved' : 'Open'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Text className="text-ui-fg-subtle text-sm">{complaint.description}</Text>
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
