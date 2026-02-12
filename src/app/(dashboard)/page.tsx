import { Users, FileCheck, Trophy, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/cards/stat-card"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

async function getDashboardStats() {
  try {
    const [memberCount, activeLicenses, competitionCount, pendingCount] = await Promise.all([
      prisma.member.count(),
      prisma.license.count({ where: { status: "APPROVED" } }),
      prisma.competition.count({
        where: {
          startDate: { gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      }),
      Promise.all([
        prisma.document.count({ where: { status: "UPLOADED" } }),
        prisma.license.count({ where: { status: "PENDING" } }),
        prisma.registration.count({ where: { status: "PENDING" } }),
      ]).then(([docs, licenses, regs]) => docs + licenses + regs),
    ])

    return { memberCount, activeLicenses, competitionCount, pendingCount }
  } catch {
    return { memberCount: 0, activeLicenses: 0, competitionCount: 0, pendingCount: 0 }
  }
}

async function getUpcomingCompetitions() {
  try {
    return await prisma.competition.findMany({
      where: {
        startDate: { gte: new Date() },
        status: { not: "CANCELLED" },
      },
      orderBy: { startDate: "asc" },
      take: 5,
    })
  } catch {
    return []
  }
}

async function getRecentActivity() {
  try {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { fullName: true } } },
    })
  } catch {
    return []
  }
}

const competitionStatusLabels: Record<string, string> = {
  DRAFT: "Черновик",
  REGISTRATION_OPEN: "Регистрация открыта",
  REGISTRATION_CLOSED: "Регистрация закрыта",
  IN_PROGRESS: "В процессе",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
}

const competitionStatusVariant: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  REGISTRATION_OPEN: "bg-emerald-50 text-emerald-700",
  REGISTRATION_CLOSED: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
}

const auditActionLabels: Record<string, string> = {
  "member.create": "Создан новый член",
  "member.update": "Обновлён профиль члена",
  "license.approve": "Утверждена лицензия",
  "license.reject": "Отклонена лицензия",
  "document.approve": "Утверждён документ",
  "document.reject": "Отклонён документ",
  "competition.create": "Создано соревнование",
  "registration.approve": "Утверждена регистрация",
  "match.result": "Внесён результат матча",
}

export default async function DashboardPage() {
  const [stats, competitions, activity] = await Promise.all([
    getDashboardStats(),
    getUpcomingCompetitions(),
    getRecentActivity(),
  ])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Обзор системы управления Федерации Таэквондо Узбекистана
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего членов"
          value={stats.memberCount}
          icon={Users}
          trend={{ value: 12, positive: true }}
          description="За всё время"
        />
        <StatCard
          title="Активных лицензий"
          value={stats.activeLicenses}
          icon={FileCheck}
          trend={{ value: 8, positive: true }}
          description="Действующих"
        />
        <StatCard
          title="Соревнований"
          value={stats.competitionCount}
          icon={Trophy}
          description="В этом году"
        />
        <StatCard
          title="Ожидают рассмотрения"
          value={stats.pendingCount}
          icon={Clock}
          description="Документы, лицензии, регистрации"
        />
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming competitions */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Ближайшие соревнования
            </CardTitle>
          </CardHeader>
          <CardContent>
            {competitions.length === 0 ? (
              <div className="py-8 text-center">
                <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Нет предстоящих соревнований
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {competitions.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {comp.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(comp.startDate)} — {comp.venueCity}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={competitionStatusVariant[comp.status] || ""}
                    >
                      {competitionStatusLabels[comp.status] || comp.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Последняя активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Нет записей активности
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        {auditActionLabels[log.action] || log.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {log.user.fullName} — {formatDate(log.createdAt, "dd.MM.yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
