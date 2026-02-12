"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  FileCheck,
  FileText,
  Trophy,
  GitBranch,
  BarChart3,
  Map,
  Building2,
  Settings,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const iconMap = {
  LayoutDashboard,
  Users,
  FileCheck,
  FileText,
  Trophy,
  GitBranch,
  BarChart3,
  Map,
  Building2,
  Settings,
  History,
} as const

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  href: string
  icon: keyof typeof iconMap
}

const allItems: { title: string; items: NavItem[] }[] = [
  {
    title: "Основное",
    items: [
      { label: "Главная", href: "/", icon: "LayoutDashboard" },
      { label: "Члены федерации", href: "/members", icon: "Users" },
      { label: "Лицензии", href: "/licenses", icon: "FileCheck" },
      { label: "Документы", href: "/documents", icon: "FileText" },
      { label: "Соревнования", href: "/competitions", icon: "Trophy" },
      { label: "Жеребьёвка", href: "/draws", icon: "GitBranch" },
      { label: "Рейтинги", href: "/rankings", icon: "BarChart3" },
    ],
  },
  {
    title: "Организации",
    items: [
      { label: "Области", href: "/organizations/regions", icon: "Map" },
      { label: "Клубы", href: "/organizations/clubs", icon: "Building2" },
    ],
  },
  {
    title: "Система",
    items: [
      { label: "Настройки", href: "/settings", icon: "Settings" },
      { label: "Журнал действий", href: "/settings/audit-log", icon: "History" },
    ],
  },
]

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground">
        <SheetHeader className="h-16 flex flex-row items-center gap-3 px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tkd-red-500 to-tkd-red-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">TKD</span>
          </div>
          <SheetTitle className="text-sm font-bold text-sidebar-foreground">
            TKD-UZ GMS
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
          <nav className="space-y-6">
            {allItems.map((section, i) => (
              <div key={section.title}>
                <div className="px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                    {section.title}
                  </span>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = iconMap[item.icon]
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
                {i < allItems.length - 1 && (
                  <Separator className="mt-4 bg-sidebar-border" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
