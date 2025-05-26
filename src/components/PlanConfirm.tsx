import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

type Props = {
  onConfirm: () => void
}

export default function PlanConfirmPrompt({ onConfirm }: Props) {
  return (
    <div className="space-y-3 text-sm max-w-md">
      <p className="text-muted-foreground">
        Would you like to make any tweaks, or shall I go ahead and schedule this in your task view?
      </p>
      <Button
        onClick={onConfirm}
        className="flex items-center gap-2 text-sm px-3 py-1.5"
      >
        <CheckCircle className="w-4 h-4" />
        Schedule My Tasks
      </Button>
    </div>
  )
}
