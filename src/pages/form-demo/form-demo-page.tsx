import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { useFormDraftStore } from "@/stores/form-draft"
import { useEffect, useRef } from "react"
import { Send, FileText, Tag, AlignLeft } from "lucide-react"

const CATEGORIES = [
  { value: "feature", label: "Feature Request" },
  { value: "bug", label: "Bug Report" },
  { value: "other", label: "Other" },
  { value: "fail", label: "Always Fails (test error path)" },
] as const

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

async function submitFeedback(data: FormValues) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? `Request failed (${res.status})`)
  }
  return res.json() as Promise<{ id: string } & FormValues>
}

export default function FormDemoPage() {
  const { title, category, description, setDraft, clearDraft } =
    useFormDraftStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title, category, description },
  })

  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Restore draft from Zustand on mount (already set via defaultValues)
  const draftRestored = useRef(false)
  useEffect(() => {
    if (!draftRestored.current && (title || category || description)) {
      form.reset({ title, category, description })
      draftRestored.current = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Watch form values, debounce writes to Zustand draft store
  const watched = form.watch()
  useEffect(() => {
    clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      setDraft({
        title: watched.title,
        category: watched.category,
        description: watched.description,
      })
    }, 300)
    return () => clearTimeout(draftTimer.current)
  }, [watched, setDraft])

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: (data) => {
      clearDraft()
      form.reset({ title: "", category: "", description: "" })
      toast.success("Feedback submitted", {
        description: `ID: ${data.id}`,
      })
    },
    onError: (error) => {
      const currentDraft = form.getValues()
      setDraft(currentDraft)
      toast.error("Submission failed", {
        description:
          error instanceof Error ? error.message : "Unknown error",
      })
    },
  })

  function onSubmit(data: FormValues) {
    mutation.mutate(data)
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback Form</h1>
        <p className="text-muted-foreground mt-1">
          TanStack Query <code className="text-xs bg-muted px-1 py-0.5 rounded">useMutation</code>
          {" + "}
          shadcn Form
          {" + "}
          Zustand draft persistence.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Brief summary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <AlignLeft className="h-4 w-4" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Details (at least 10 characters)"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your feedback helps improve the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Draft indicator */}
      {(watched.title || watched.category || watched.description) && (
        <div className="rounded-[var(--radius)] border bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Draft auto-saved to{" "}
            <code className="text-foreground">chives-form-draft</code> in
            localStorage via Zustand <code>persist</code> middleware.
          </p>
        </div>
      )}
    </div>
  )
}
