import { Plus, Users, Download } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MEMBER_STATUS_LABELS,
  MEMBER_TYPE_LABELS,
  BELT_RANK_LABELS,
  MEMBER_STATUS_VARIANT,
} from "@/lib/constants"
import { StatusBadge } from "@/components/shared/status-badge"
import { BeltBadge } from "@/components/shared/belt-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

async function getMembers() {
  try {
    return await prisma.member.findMany({
      include: {
        region: { select: { name: true } },
        club: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

async function getMemberStats() {
  try {
    const [total, active, pending, athletes, coaches] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.member.count({ where: { status: "PENDING" } }),
      prisma.member.count({ where: { memberType: "ATHLETE" } }),
      prisma.member.count({ where: { memberType: "COACH" } }),
    ])
    return { total, active, pending, athletes, coaches }
  } catch {
    return { total: 0, active: 0, pending: 0, athletes: 0, coaches: 0 }
  }
}

export default async function MembersPage() {
  const [members, stats] = await Promise.all([getMembers(), getMemberStats()])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Члены федерации</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление спортсменами, тренерами, судьями и официальными лицами
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <Button size="sm" asChild>
            <Link href="/members/new">
              <Plus className="mr-2 h-4 w-4" />
              Добавить члена
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
        {[
          { label: "Всего", value: stats.total, color: "bg-blue-500" },
          { label: "Активных", value: stats.active, color: "bg-emerald-500" },
          { label: "На рассмотрении", value: stats.pending, color: "bg-amber-500" },
          { label: "Спортсменов", value: stats.athletes, color: "bg-violet-500" },
          { label: "Тренеров", value: stats.coaches, color: "bg-cyan-500" },
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

      {/* Members table */}
      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Нет членов федерации"
          description="Добавьте первого члена федерации, чтобы начать работу с системой"
          actionLabel="Добавить члена"
          actionHref="/members/new"
        />
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ФИО</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Тип</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Пояс</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Область</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Клуб</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Статус</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <span className="text-xs font-mono text-muted-foreground">{member.memberId}</span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium">{member.fullName}</p>
                        {member.fullNameLatin && (
                          <p className="text-xs text-muted-foreground">{member.fullNameLatin}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{MEMBER_TYPE_LABELS[member.memberType]}</span>
                    </td>
                    <td className="p-3">
                      <BeltBadge rank={member.beltRank} size="sm" />
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{member.region.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {member.club?.name || "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        variant={MEMBER_STATUS_VARIANT[member.status]}
                        label={MEMBER_STATUS_LABELS[member.status]}
                      />
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(member.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
