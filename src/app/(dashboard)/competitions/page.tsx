import { Plus, Trophy, Download, Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  COMPETITION_STATUS_LABELS,
  COMPETITION_STATUS_VARIANT,
  COMPETITION_TYPE_LABELS,
} from "@/lib/constants"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

async function getCompetitions() {
  try {
    return await prisma.competition.findMany({
      include: {
        _count: {
          select: {
            categories: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    })
  } catch {
    return []
  }
}

async function getCompetitionStats() {
  try {
    const now = new Date()
    const [total, upcoming, inProgress, completed] = await Promise.all([
      prisma.competition.count(),
      prisma.competition.count({
        where: {
          startDate: { gte: now },
          status: { in: ["DRAFT", "REGISTRATION_OPEN", "REGISTRATION_CLOSED"] },
        },
      }),
      prisma.competition.count({ where: { status: "IN_PROGRESS" } }),
      prisma.competition.count({ where: { status: "COMPLETED" } }),
    ])
    return { total, upcoming, inProgress, completed }
  } catch {
    return { total: 0, upcoming: 0, inProgress: 0, completed: 0 }
  }
}

export default async function CompetitionsPage() {
  const [competitions, stats] = await Promise.all([
    getCompetitions(),
    getCompetitionStats(),
  ])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Соревнования</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление турнирами, чемпионатами и отборочными соревнованиями
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <Button size="sm" asChild>
            <Link href="/competitions/new">
              <Plus className="mr-2 h-4 w-4" />
              Создать соревнование
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Всего", value: stats.total, color: "bg-blue-500" },
          { label: "Предстоящих", value: stats.upcoming, color: "bg-amber-500" },
          { label: "Идут сейчас", value: stats.inProgress, color: "bg-violet-500" },
          { label: "Завершённых", value: stats.completed, color: "bg-emerald-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitions list */}
      {competitions.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Нет соревнований"
          description="Создайте первое соревнование для управления турнирами"
          actionLabel="Создать соревнование"
          actionHref="/competitions/new"
        />
      ) : (
        <div className="grid gap-4">
          {competitions.map((comp) => (
            <Card key={comp.id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold">{comp.name}</h3>
                      <StatusBadge
                        variant={COMPETITION_STATUS_VARIANT[comp.status]}
                        label={COMPETITION_STATUS_LABELS[comp.status]}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="font-normal">
                        {COMPETITION_TYPE_LABELS[comp.type]}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(comp.startDate)} — {formatDate(comp.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{comp.venueCity}{comp.venueName ? `, ${comp.venueName}` : ""}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span>{comp._count.categories} категорий</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/competitions/${comp.id}`}>Подробнее</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
