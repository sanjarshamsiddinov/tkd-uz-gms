import { GitBranch, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  COMPETITION_STATUS_LABELS,
  COMPETITION_STATUS_VARIANT,
  AGE_GROUP_LABELS,
  GENDER_SHORT,
} from "@/lib/constants"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

async function getActiveCompetitions() {
  try {
    return await prisma.competition.findMany({
      where: {
        status: { in: ["REGISTRATION_CLOSED", "IN_PROGRESS"] },
      },
      include: {
        categories: {
          include: {
            _count: {
              select: {
                registrations: { where: { status: "APPROVED" } },
                matches: true,
              },
            },
          },
        },
      },
      orderBy: { startDate: "asc" },
    })
  } catch {
    return []
  }
}

export default async function DrawsPage() {
  const competitions = await getActiveCompetitions()

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Жеребьёвка</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление турнирными сетками и жеребьёвками соревнований
          </p>
        </div>
      </div>

      {/* Info card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Как работает жеребьёвка</p>
              <p className="text-sm text-blue-700 mt-1">
                Жеребьёвка доступна для соревнований со статусом &quot;Регистрация закрыта&quot; или &quot;В процессе&quot;.
                Выберите соревнование и категорию для формирования турнирной сетки.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitions with draws */}
      {competitions.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="Нет активных соревнований"
          description="Для создания жеребьёвки необходимо закрыть регистрацию на соревнование"
          actionLabel="К соревнованиям"
          actionHref="/competitions"
        />
      ) : (
        <div className="space-y-6">
          {competitions.map((comp) => (
            <Card key={comp.id} className="border border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-lg">{comp.name}</CardTitle>
                    <StatusBadge
                      variant={COMPETITION_STATUS_VARIANT[comp.status]}
                      label={COMPETITION_STATUS_LABELS[comp.status]}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comp.startDate)} — {formatDate(comp.endDate)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {comp.categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Нет категорий в этом соревновании
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {comp.categories.map((cat) => {
                      const hasMatches = cat._count.matches > 0
                      const participantCount = cat._count.registrations

                      return (
                        <div
                          key={cat.id}
                          className="rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium">
                                {cat.displayName || `${AGE_GROUP_LABELS[cat.ageGroup]}, ${GENDER_SHORT[cat.gender]}`}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {Number(cat.weightMin)}–{Number(cat.weightMax)} кг
                              </p>
                            </div>
                            <Badge variant={hasMatches ? "default" : "secondary"} className="text-[10px]">
                              {hasMatches ? "Сетка готова" : "Ожидает"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {participantCount} участников
                            </span>
                            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                              <Link href={`/draws/${comp.id}/${cat.id}`}>
                                {hasMatches ? "Просмотр" : "Создать сетку"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
