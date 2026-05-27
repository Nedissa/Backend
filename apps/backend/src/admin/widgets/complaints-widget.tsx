import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

const ComplaintsWidget = ({ data }: any) => {
  const complaints = data?.metadata?.complaints || []

  return (
    <Container>
      <Heading level="h2">Issue Reports</Heading>

      {complaints.length === 0 ? (
        <Text className="text-ui-fg-subtle mt-2">No issue reports registered for this customer.</Text>
      ) : (
        <div className="mt-4 space-y-4">
          {complaints.map((complaint: any, index: number) => (
            <div key={index} className="border-b border-ui-border-base pb-3 last:border-b-0">
              <Text className="font-medium text-sm">Order: {complaint.order_id}</Text>
              <Text className="text-ui-fg-subtle text-sm mt-1">{complaint.description}</Text>
              <Text className="text-ui-fg-muted text-xs mt-1">
                {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-SE') : 'No date'}
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
