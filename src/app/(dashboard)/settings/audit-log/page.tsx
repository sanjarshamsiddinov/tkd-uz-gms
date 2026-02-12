import { History, Search, Filter } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

const ACTION_LABELS: Record<string, string> = {
  "member.create": "Создание члена",
  "member.update": "Обновление члена",
  "member.delete": "Удаление члена",
  "member.status_change": "Изменение статуса члена",
  "license.create": "Создание лицензии",
  "license.approve": "Утверждение лицензии",
  "license.reject": "Отклонение лицензии",
  "license.suspend": "Приостановка лицензии",
  "document.upload": "Загрузка документа",
  "document.approve": "Утверждение документа",
  "document.reject": "Отклонение документа",
  "competition.create": "Создание соревнования",
  "competition.update": "Обновление соревнования",
  "competition.status_change": "Изменение статуса соревнования",
  "registration.create": "Создание регистрации",
  "registration.approve": "Утверждение регистрации",
  "registration.reject": "Отклонение регистрации",
  "match.create": "Создание матча",
  "match.result": "Внесение результата",
  "user.login": "Вход в систему",
  "user.logout": "Выход из системы",
  "user.create": "Создание пользователя",
  "settings.update": "Изменение настроек",
}

const ENTITY_COLORS: Record<string, string> = {
  member: "bg-blue-50 text-blue-700 border-blue-200",
  license: "bg-violet-50 text-violet-700 border-violet-200",
  document: "bg-amber-50 text-amber-700 border-amber-200",
  competition: "bg-emerald-50 text-emerald-700 border-emerald-200",
  registration: "bg-cyan-50 text-cyan-700 border-cyan-200",
  match: "bg-orange-50 text-orange-700 border-orange-200",
  user: "bg-slate-100 text-slate-700 border-slate-200",
  settings: "bg-pink-50 text-pink-700 border-pink-200",
}

const ENTITY_LABELS: Record<string, string> = {
  member: "Член",
  license: "Лицензия",
  document: "Документ",
  competition: "Соревнование",
  registration: "Регистрация",
  match: "Матч",
  user: "Пользователь",
  settings: "Настройки",
}

async function getAuditLogs() {
  try {
    return await prisma.auditLog.findMany({
      include: {
        user: {
          select: { fullName: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
  } catch {
    return []
  }
}

async function getAuditStats() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [total, today, thisWeek] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.auditLog.count({ where: { createdAt: { gte: weekStart } } }),
    ])
    return { total, today, thisWeek }
  } catch {
    return { total: 0, today: 0, thisWeek: 0 }
  }
}

export default async function AuditLogPage() {
  const [logs, stats] = await Promise.all([getAuditLogs(), getAuditStats()])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Журнал действий</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Полный журнал всех действий в системе для аудита и безопасности
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-blue-600 bg-blue-50">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Всего записей</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-emerald-600 bg-emerald-50">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-xs text-muted-foreground">Сегодня</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-violet-600 bg-violet-50">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">За неделю</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit log entries */}
      {logs.length === 0 ? (
        <EmptyState
          icon={History}
          title="Журнал пуст"
          description="Действия пользователей будут записываться автоматически"
        />
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Последние 100 записей
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Дата и время</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Пользователь</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Действие</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Сущность</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID сущности</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">IP-адрес</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {logs.map((log) => {
                    const entityType = log.entityType.toLowerCase()
                    const entityColor = ENTITY_COLORS[entityType] || "bg-slate-100 text-slate-700 border-slate-200"
                    const entityLabel = ENTITY_LABELS[entityType] || log.entityType

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          <span className="text-xs text-muted-foreground font-mono">
                            {formatDate(log.createdAt, "dd.MM.yyyy HH:mm:ss")}
                          </span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-sm font-medium">{log.user.fullName}</p>
                            <p className="text-xs text-muted-foreground">{log.user.email}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={`text-[10px] ${entityColor}`}>
                            {entityLabel}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-xs font-mono text-muted-foreground truncate max-w-[120px] block">
                            {log.entityId}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-muted-foreground font-mono">
                            {log.ipAddress || "—"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
