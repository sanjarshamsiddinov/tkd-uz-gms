"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  ChevronLeft,
  LogOut,
  UserCircle,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface SidebarProps {
  user: {
    fullName: string
    role: string
    avatarUrl?: string | null
  }
}

interface NavItem {
  label: string
  href: string
  icon: keyof typeof iconMap
  badge?: number
}

const mainNav: NavItem[] = [
  { label: "Главная", href: "/", icon: "LayoutDashboard" },
  { label: "Члены федерации", href: "/members", icon: "Users" },
  { label: "Лицензии", href: "/licenses", icon: "FileCheck" },
  { label: "Документы", href: "/documents", icon: "FileText" },
  { label: "Соревнования", href: "/competitions", icon: "Trophy" },
  { label: "Жеребьёвка", href: "/draws", icon: "GitBranch" },
  { label: "Рейтинги", href: "/rankings", icon: "BarChart3" },
]

const orgNav: NavItem[] = [
  { label: "Области", href: "/organizations/regions", icon: "Map" },
  { label: "Клубы", href: "/organizations/clubs", icon: "Building2" },
]

const settingsNav: NavItem[] = [
  { label: "Настройки", href: "/settings", icon: "Settings" },
  { label: "Журнал действий", href: "/settings/audit-log", icon: "History" },
]

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Суперадмин",
  FED_ADMIN: "Админ федерации",
  REGION_ADMIN: "Админ области",
  COACH: "Тренер",
  JUDGE: "Судья",
  ATHLETE: "Спортсмен",
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = iconMap[item.icon]
    const active = isActive(item.href)

    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className={cn("h-4.5 w-4.5 shrink-0", collapsed && "h-5 w-5")} />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto bg-tkd-red-500 text-white text-[10px] h-5 px-1.5"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  const NavSection = ({
    title,
    items,
  }: {
    title: string
    items: NavItem[]
  }) => (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {title}
          </span>
        </div>
      )}
      {items.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </div>
  )

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border shrink-0",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tkd-red-500 to-tkd-red-700 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">TKD</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-sidebar-foreground truncate">
              TKD-UZ GMS
            </div>
            <div className="text-[10px] text-sidebar-foreground/50">
              Система управления
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          <NavSection title="Основное" items={mainNav} />
          <Separator className="bg-sidebar-border" />
          <NavSection title="Организации" items={orgNav} />
          <Separator className="bg-sidebar-border" />
          <NavSection title="Система" items={settingsNav} />
        </nav>
      </ScrollArea>

      {/* User section - always pinned at bottom */}
      <div className="shrink-0 border-t border-sidebar-border px-3 py-3 space-y-1.5">
        {/* Profile link */}
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
            isActive("/profile")
              ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {user.fullName}
              </p>
              <p className="text-[10px] opacity-60">
                {roleLabels[user.role] || user.role}
              </p>
            </div>
          )}
        </Link>

        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-tkd-red-400 hover:bg-tkd-red-500/10 transition-all duration-200",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Выйти из системы</span>}
        </button>
      </div>
    </aside>
  )
}
