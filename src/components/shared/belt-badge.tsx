import { BeltRank } from "@prisma/client"
import { cn } from "@/lib/utils"
import { BELT_RANK_LABELS, BELT_RANK_COLORS } from "@/lib/constants"

interface BeltBadgeProps {
  rank: BeltRank
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BeltBadge({
  rank,
  showLabel = true,
  size = "md",
  className,
}: BeltBadgeProps) {
  const colors = BELT_RANK_COLORS[rank]
  const label = BELT_RANK_LABELS[rank]

  // For DAN ranks, show stars
  const danNumber = rank.startsWith("DAN_") ? parseInt(rank.split("_")[1]) : 0

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const textSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center shrink-0",
          sizeClasses[size],
          colors.bg,
          colors.text,
          colors.border
        )}
      >
        {danNumber > 0 && (
          <span className={cn("font-bold", textSizes[size])}>{danNumber}</span>
        )}
      </div>
      {showLabel && (
        <span className="text-sm truncate">{label}</span>
      )}
    </div>
  )
}
