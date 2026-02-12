import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { type StatusVariant, STATUS_VARIANTS } from "@/lib/constants"

interface StatusBadgeProps {
  variant: StatusVariant
  label: string
  className?: string
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border px-2 py-0.5",
        STATUS_VARIANTS[variant],
        className
      )}
    >
      {label}
    </Badge>
  )
}
