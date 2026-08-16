import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Container, Heading, Text, Textarea, Button } from "@medusajs/ui"
import { useEffect, useState } from "react"

const GuideQuestionsPage = () => {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/admin/guide-questions`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        setQuestions(json.questions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleAnswer = async (questionId: string) => {
    const answer = drafts[questionId]?.trim()
    if (!answer) return

    setSaving(questionId)
    try {
      const res = await fetch(`/admin/guide-questions/${questionId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      })

      if (res.ok) {
        const json = await res.json()
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? json.question : q))
        )
      }
    } catch (error) {
      console.error("Failed to save answer:", error)
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (questionId: string) => {
    setSaving(questionId)
    try {
      const res = await fetch(`/admin/guide-questions/${questionId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      }
    } catch (error) {
      console.error("Failed to delete question:", error)
    } finally {
      setSaving(null)
    }
  }

  const pending = questions.filter((q) => q.status === "pending")
  const answered = questions.filter((q) => q.status === "answered")

  return (
    <Container>
      <Heading level="h1">Guide Questions & Answers</Heading>

      {loading ? (
        <Text className="text-ui-fg-subtle mt-2">Loading...</Text>
      ) : questions.length === 0 ? (
        <Text className="text-ui-fg-subtle mt-2">No guide questions yet.</Text>
      ) : (
        <div className="mt-4 space-y-4">
          {pending.map((q: any) => (
            <div key={q.id} className="border border-ui-border-base rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Text className="font-medium text-sm">{q.customer_name}</Text>
                <Text className="text-ui-fg-muted text-xs">{q.guide_slug}</Text>
              </div>
              <Text className="text-ui-fg-subtle text-sm mb-2">{q.question}</Text>
              <Textarea
                placeholder="Write an answer..."
                value={drafts[q.id] || ""}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() => handleAnswer(q.id)}
                  disabled={saving === q.id || !drafts[q.id]?.trim()}
                >
                  Publish answer
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleDelete(q.id)}
                  disabled={saving === q.id}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {answered.length > 0 && (
            <>
              <Text className="text-ui-fg-muted text-xs font-medium mt-6">ANSWERED</Text>
              {answered.map((q: any) => (
                <div key={q.id} className="border border-ui-border-base rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Text className="font-medium text-sm">{q.customer_name}</Text>
                    <Text className="text-ui-fg-muted text-xs">{q.guide_slug}</Text>
                  </div>
                  <Text className="text-ui-fg-subtle text-sm mt-1">{q.question}</Text>
                  <Text className="text-ui-fg-base text-sm mt-2 border-t border-ui-border-base pt-2">
                    {q.answer}
                  </Text>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Guide Q&A",
  icon: ChatBubbleLeftRight,
})

export default GuideQuestionsPage
