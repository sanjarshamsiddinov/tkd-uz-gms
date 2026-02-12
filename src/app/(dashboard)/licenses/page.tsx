import { Plus, FileCheck, Download, Clock, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  LICENSE_STATUS_LABELS,
  LICENSE_STATUS_VARIANT,
} from "@/lib/constants"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

async function getLicenses() {
  try {
    return await prisma.license.findMany({
      include: {
        member: {
          select: { fullName: true, memberId: true, memberType: true },
        },
        approvedBy: {
          select: { fullName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

async function getLicenseStats() {
  try {
    const [total, approved, pending, expired, rejected] = await Promise.all([
      prisma.license.count(),
      prisma.license.count({ where: { status: "APPROVED" } }),
      prisma.license.count({ where: { status: "PENDING" } }),
      prisma.license.count({ where: { status: "EXPIRED" } }),
      prisma.license.count({ where: { status: "REJECTED" } }),
    ])
    return { total, approved, pending, expired, rejected }
  } catch {
    return { total: 0, approved: 0, pending: 0, expired: 0, rejected: 0 }
  }
}

export default async function LicensesPage() {
  const [licenses, stats] = await Promise.all([getLicenses(), getLicenseStats()])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Лицензии</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление лицензиями GAL, GCL и GOL для членов федерации
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <Button size="sm" asChild>
            <Link href="/licenses/new">
              <Plus className="mr-2 h-4 w-4" />
              Новая лицензия
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
        {[
          { label: "Всего", value: stats.total, icon: FileCheck, color: "text-blue-600 bg-blue-50" },
          { label: "Утверждённых", value: stats.approved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "На рассмотрении", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Истёкших", value: stats.expired, icon: Clock, color: "text-slate-500 bg-slate-50" },
          { label: "Отклонённых", value: stats.rejected, icon: XCircle, color: "text-red-600 bg-red-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Licenses table */}
      {licenses.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="Нет лицензий"
          description="Создайте первую лицензию для члена федерации"
          actionLabel="Создать лицензию"
          actionHref="/licenses/new"
        />
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Номер</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Член федерации</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Тип</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Статус</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Выдана</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Истекает</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Утвердил</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {licenses.map((license) => (
                  <tr
                    key={license.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <span className="text-sm font-mono font-medium">
                        {license.licenseNumber || "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium">{license.member.fullName}</p>
                        <p className="text-xs text-muted-foreground">{license.member.memberId}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium">{license.type}</span>
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        variant={LICENSE_STATUS_VARIANT[license.status]}
                        label={LICENSE_STATUS_LABELS[license.status]}
                      />
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {license.issuedAt ? formatDate(license.issuedAt) : "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {license.expiresAt ? formatDate(license.expiresAt) : "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {license.approvedBy?.fullName || "—"}
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
