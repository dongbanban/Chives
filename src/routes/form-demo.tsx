import { createFileRoute } from "@tanstack/react-router"
import FormDemoPage from "@/pages/form-demo/form-demo-page"

export const Route = createFileRoute("/form-demo")({
  component: FormDemoPage,
})
