import { BarChart3, Medal, TrendingUp, Crown } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MEMBER_TYPE_LABELS,
  BELT_RANK_LABELS,
  AGE_GROUP_LABELS,
  GENDER_LABELS,
} from "@/lib/constants"
import { BeltBadge } from "@/components/shared/belt-badge"
import { EmptyState } from "@/components/shared/empty-state"

async function getTopRankedMembers() {
  try {
    return await prisma.member.findMany({
      where: {
        status: "ACTIVE",
        ratingPoints: { gt: 0 },
      },
      include: {
        region: { select: { name: true } },
        club: { select: { name: true } },
      },
      orderBy: { ratingPoints: "desc" },
      take: 50,
    })
  } catch {
    return []
  }
}

async function getRankingConfigs() {
  try {
    return await prisma.rankingConfig.findMany({
      orderBy: { competitionType: "asc" },
    })
  } catch {
    return []
  }
}

async function getRankingStats() {
  try {
    const [rankedCount, totalPoints, topRegion] = await Promise.all([
      prisma.member.count({ where: { ratingPoints: { gt: 0 } } }),
      prisma.member.aggregate({ _sum: { ratingPoints: true } }),
      prisma.member.groupBy({
        by: ["regionId"],
        _sum: { ratingPoints: true },
        where: { ratingPoints: { gt: 0 } },
        orderBy: { _sum: { ratingPoints: "desc" } },
        take: 1,
      }),
    ])

    let topRegionName = "—"
    if (topRegion.length > 0) {
      const region = await prisma.region.findUnique({
        where: { id: topRegion[0].regionId },
        select: { name: true },
      })
      topRegionName = region?.name || "—"
    }

    return {
      rankedCount,
      totalPoints: totalPoints._sum.ratingPoints || 0,
      topRegionName,
    }
  } catch {
    return { rankedCount: 0, totalPoints: 0, topRegionName: "—" }
  }
}

export default async function RankingsPage() {
  const [members, configs, stats] = await Promise.all([
    getTopRankedMembers(),
    getRankingConfigs(),
    getRankingStats(),
  ])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Рейтинги</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Рейтинговая таблица спортсменов Федерации Таэквондо Узбекистана
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-violet-600 bg-violet-50">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rankedCount}</p>
                <p className="text-xs text-muted-foreground">В рейтинге</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-amber-600 bg-amber-50">
                <Medal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Общая сумма очков</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-emerald-600 bg-emerald-50">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold truncate">{stats.topRegionName}</p>
                <p className="text-xs text-muted-foreground">Лидирующая область</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings table */}
      {members.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Нет рейтинговых данных"
          description="Рейтинговые очки начисляются по результатам соревнований"
        />
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Топ-50 спортсменов</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16">#</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Спортсмен</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Пояс</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Область</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Клуб</th>
                    <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Очки</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {members.map((member, idx) => (
                    <tr
                      key={member.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 text-center">
                        {idx < 3 ? (
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            idx === 0
                              ? "bg-amber-100 text-amber-700"
                              : idx === 1
                              ? "bg-slate-100 text-slate-600"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {idx + 1}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground font-medium">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium">{member.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {MEMBER_TYPE_LABELS[member.memberType]}
                          </p>
                        </div>
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
                      <td className="p-3 text-right">
                        <span className="text-sm font-bold text-primary">
                          {member.ratingPoints.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking config */}
      {configs.length > 0 && (
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Система начисления очков</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Тип соревнования</th>
                    <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">🥇 1 место</th>
                    <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">🥈 2 место</th>
                    <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">🥉 3 место</th>
                    <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">5 место</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {configs.map((cfg) => (
                    <tr key={cfg.id}>
                      <td className="p-3 text-sm font-medium">
                        {cfg.competitionType === "CHAMPIONSHIP" ? "Чемпионат" :
                         cfg.competitionType === "CUP" ? "Кубок" :
                         cfg.competitionType === "OPEN" ? "Открытый турнир" :
                         cfg.competitionType === "QUALIFIER" ? "Отборочный" :
                         "Международный"}
                      </td>
                      <td className="p-3 text-center text-sm font-bold text-amber-600">{cfg.place1Points}</td>
                      <td className="p-3 text-center text-sm font-bold text-slate-500">{cfg.place2Points}</td>
                      <td className="p-3 text-center text-sm font-bold text-orange-600">{cfg.place3Points}</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">{cfg.place5Points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
