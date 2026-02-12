import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Key,
  Bell,
  Lock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Суперадмин",
  FED_ADMIN: "Администратор федерации",
  REGION_ADMIN: "Администратор области",
  COACH: "Тренер",
  JUDGE: "Судья",
  ATHLETE: "Спортсмен",
}

const roleBadgeColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700 border-red-200",
  FED_ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
  REGION_ADMIN: "bg-violet-50 text-violet-700 border-violet-200",
  COACH: "bg-emerald-50 text-emerald-700 border-emerald-200",
  JUDGE: "bg-amber-50 text-amber-700 border-amber-200",
  ATHLETE: "bg-cyan-50 text-cyan-700 border-cyan-200",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

async function getUserProfile(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        region: { select: { name: true } },
        club: { select: { name: true } },
        member: {
          select: {
            memberId: true,
            fullName: true,
            beltRank: true,
            memberType: true,
            ratingPoints: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await getUserProfile(session.user.id)
  if (!user) redirect("/login")

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Личный кабинет</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управление вашим профилем и настройками аккаунта
        </p>
      </div>

      {/* Profile card */}
      <Card className="border border-border/50 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-navy-800 via-navy-700 to-navy-900 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        </div>

        <CardContent className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-16 mb-4 flex items-end gap-5">
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${roleBadgeColors[user.role] || ""}`}>
                  {roleLabels[user.role] || user.role}
                </Badge>
                {user.isActive ? (
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    Активен
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                    Неактивен
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Info grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Mail className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Shield className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Роль</p>
                <p className="text-sm font-medium">{roleLabels[user.role] || user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Calendar className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Дата регистрации</p>
                <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Последний вход</p>
                <p className="text-sm font-medium">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt, "dd.MM.yyyy HH:mm") : "—"}
                </p>
              </div>
            </div>

            {user.region && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <MapPin className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Область</p>
                  <p className="text-sm font-medium">{user.region.name}</p>
                </div>
              </div>
            )}

            {user.club && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Building2 className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Клуб</p>
                  <p className="text-sm font-medium">{user.club.name}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-blue-600 bg-blue-50">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Редактировать профиль</CardTitle>
                <CardDescription className="text-xs">Изменить ФИО и контактные данные</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Редактировать
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-amber-600 bg-amber-50">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Сменить пароль</CardTitle>
                <CardDescription className="text-xs">Обновить пароль вашего аккаунта</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Сменить пароль
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 text-violet-600 bg-violet-50">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Уведомления</CardTitle>
                <CardDescription className="text-xs">Настроить email-уведомления</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Настроить
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
