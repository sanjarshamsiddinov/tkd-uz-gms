import { Plus, Building2, Users, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"

async function getClubs() {
  try {
    return await prisma.club.findMany({
      include: {
        region: { select: { name: true } },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })
  } catch {
    return []
  }
}

async function getClubStats() {
  try {
    const [total, active, totalMembers] = await Promise.all([
      prisma.club.count(),
      prisma.club.count({ where: { isActive: true } }),
      prisma.member.count({ where: { clubId: { not: null } } }),
    ])
    return { total, active, totalMembers }
  } catch {
    return { total: 0, active: 0, totalMembers: 0 }
  }
}

export default async function ClubsPage() {
  const [clubs, stats] = await Promise.all([getClubs(), getClubStats()])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Клубы</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Спортивные клубы и секции таэквондо по всему Узбекистану
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/organizations/clubs/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить клуб
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-blue-600 bg-blue-50">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Всего клубов</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-emerald-600 bg-emerald-50">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Активных</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-violet-600 bg-violet-50">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
                <p className="text-xs text-muted-foreground">Членов в клубах</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs table */}
      {clubs.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Нет клубов"
          description="Добавьте первый спортивный клуб в систему"
          actionLabel="Добавить клуб"
          actionHref="/organizations/clubs/new"
        />
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Название</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Область</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Тренер</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Адрес</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Членов</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Телефон</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {clubs.map((club) => (
                  <tr
                    key={club.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <span className="text-sm font-medium">{club.name}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{club.region.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{club.coachName || "—"}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                        {club.address || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="font-medium">
                        {club._count.members}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{club.contactPhone || "—"}</span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={club.isActive ? "default" : "secondary"} className="text-[10px]">
                        {club.isActive ? "Активен" : "Неактивен"}
                      </Badge>
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
