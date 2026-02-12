import { Settings, Shield, Bell, Palette, Database, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const settingsSections = [
  {
    title: "Общие настройки",
    description: "Основные параметры системы управления",
    icon: Settings,
    color: "text-blue-600 bg-blue-50",
    items: [
      { label: "Название организации", value: "Федерация Таэквондо Узбекистана" },
      { label: "Язык системы", value: "Русский" },
      { label: "Часовой пояс", value: "Asia/Tashkent (UTC+5)" },
      { label: "Формат даты", value: "ДД.ММ.ГГГГ" },
    ],
  },
  {
    title: "Безопасность",
    description: "Параметры аутентификации и безопасности",
    icon: Shield,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { label: "Двухфакторная аутентификация", value: "Отключена" },
      { label: "Длительность сессии", value: "7 дней" },
      { label: "Минимальная длина пароля", value: "8 символов" },
      { label: "Блокировка после неудачных попыток", value: "5 попыток" },
    ],
  },
  {
    title: "Уведомления",
    description: "Настройки email- и push-уведомлений",
    icon: Bell,
    color: "text-amber-600 bg-amber-50",
    items: [
      { label: "Email-уведомления", value: "Включены" },
      { label: "Уведомления о новых регистрациях", value: "Включены" },
      { label: "Уведомления об истечении лицензий", value: "Включены" },
      { label: "Уведомления о соревнованиях", value: "Включены" },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управление параметрами системы и конфигурацией
        </p>
      </div>

      {/* System info */}
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tkd-red-500 to-tkd-red-700 flex items-center justify-center">
                <span className="text-white text-lg font-bold">TKD</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">TKD-UZ GMS</h2>
                <p className="text-sm text-muted-foreground">
                  Система управления Федерации Таэквондо Узбекистана
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="font-mono">v0.1.0</Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Система работает
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings sections */}
      <div className="grid gap-6">
        {settingsSections.map((section) => (
          <Card key={section.title} className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${section.color}`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <CardDescription className="text-xs">{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-border/50">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <a href="/settings/audit-log">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Журнал действий</p>
                    <p className="text-xs text-muted-foreground">Просмотр всех действий в системе</p>
                  </div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">API настройки</p>
                  <p className="text-xs text-muted-foreground">Управление API-ключами</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Оформление</p>
                  <p className="text-xs text-muted-foreground">Настройка темы и внешнего вида</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
