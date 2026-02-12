"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const routeLabels: Record<string, string> = {
  "": "Главная",
  members: "Члены федерации",
  new: "Новый",
  edit: "Редактирование",
  import: "Импорт",
  licenses: "Лицензии",
  pending: "Ожидающие",
  documents: "Документы",
  competitions: "Соревнования",
  draws: "Жеребьёвка",
  rankings: "Рейтинги",
  config: "Настройки",
  medals: "Медали",
  organizations: "Организации",
  regions: "Области",
  clubs: "Клубы",
  settings: "Настройки",
  profile: "Профиль",
  "audit-log": "Журнал действий",
  register: "Регистрация",
  registrations: "Регистрации",
  categories: "Категории",
  "weigh-in": "Взвешивание",
  schedule: "Расписание",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <span className="ml-2 font-medium text-foreground">Главная</span>
      </div>
    )
  }

  return (
    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isLast = index === segments.length - 1
        const isId = segment.startsWith("cl") || segment.length > 15
        const label = routeLabels[segment] || (isId ? "..." : segment)

        return (
          <div key={href} className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
