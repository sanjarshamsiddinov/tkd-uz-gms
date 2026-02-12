import { Plus, Map, Building2, Users, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"

async function getRegions() {
  try {
    return await prisma.region.findMany({
      include: {
        _count: {
          select: {
            clubs: true,
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

export default async function RegionsPage() {
  const regions = await getRegions()

  const totalClubs = regions.reduce((sum, r) => sum + r._count.clubs, 0)
  const totalMembers = regions.reduce((sum, r) => sum + r._count.members, 0)
  const activeRegions = regions.filter((r) => r.isActive).length

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Области</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Региональные подразделения Федерации Таэквондо Узбекистана
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/organizations/regions/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить область
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-blue-600 bg-blue-50">
                <Map className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeRegions}</p>
                <p className="text-xs text-muted-foreground">Активных областей</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-violet-600 bg-violet-50">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClubs}</p>
                <p className="text-xs text-muted-foreground">Всего клубов</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-emerald-600 bg-emerald-50">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMembers}</p>
                <p className="text-xs text-muted-foreground">Всего членов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regions grid */}
      {regions.length === 0 ? (
        <EmptyState
          icon={Map}
          title="Нет областей"
          description="Добавьте области для организации структуры федерации"
          actionLabel="Добавить область"
          actionHref="/organizations/regions/new"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <Card
              key={region.id}
              className="border border-border/50 shadow-sm hover:shadow-md transition-shadow group"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{region.code}</p>
                  </div>
                  <Badge variant={region.isActive ? "default" : "secondary"} className="text-[10px]">
                    {region.isActive ? "Активна" : "Неактивна"}
                  </Badge>
                </div>

                {region.headName && (
                  <p className="text-sm text-muted-foreground mb-3">
                    <span className="text-foreground font-medium">Руководитель:</span> {region.headName}
                  </p>
                )}

                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{region._count.clubs} клубов</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{region._count.members} членов</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-3 border-t border-border/50">
                  {region.contactPhone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{region.contactPhone}</span>
                    </div>
                  )}
                  {region.contactEmail && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{region.contactEmail}</span>
                    </div>
                  )}
                  {!region.contactPhone && !region.contactEmail && (
                    <p className="text-xs text-muted-foreground/60 italic">Контакты не указаны</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
