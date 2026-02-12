import { Plus, FileText, Download, Upload, Eye, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_VARIANT,
} from "@/lib/constants"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  PHOTO: "Фотография",
  PASSPORT: "Паспорт",
  BIRTH_CERTIFICATE: "Свидетельство о рождении",
  KUKKIWON_CERT: "Сертификат Kukkiwon",
  BELT_CERT: "Сертификат пояса",
  MEDICAL_CERT: "Медицинская справка",
  COACH_CERT: "Удостоверение тренера",
  REFEREE_CERT: "Удостоверение судьи",
}

async function getDocuments() {
  try {
    return await prisma.document.findMany({
      include: {
        member: {
          select: { fullName: true, memberId: true },
        },
        reviewedBy: {
          select: { fullName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

async function getDocumentStats() {
  try {
    const [total, uploaded, underReview, approved, rejected] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { status: "UPLOADED" } }),
      prisma.document.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.document.count({ where: { status: "APPROVED" } }),
      prisma.document.count({ where: { status: "REJECTED" } }),
    ])
    return { total, uploaded, underReview, approved, rejected }
  } catch {
    return { total: 0, uploaded: 0, underReview: 0, approved: 0, rejected: 0 }
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

export default async function DocumentsPage() {
  const [documents, stats] = await Promise.all([getDocuments(), getDocumentStats()])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Документы</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление документами членов федерации: паспорта, сертификаты, справки
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <Button size="sm" asChild>
            <Link href="/documents/upload">
              <Upload className="mr-2 h-4 w-4" />
              Загрузить документ
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
        {[
          { label: "Всего", value: stats.total, icon: FileText, color: "text-blue-600 bg-blue-50" },
          { label: "Загружено", value: stats.uploaded, icon: Upload, color: "text-amber-600 bg-amber-50" },
          { label: "На проверке", value: stats.underReview, icon: Eye, color: "text-violet-600 bg-violet-50" },
          { label: "Утверждено", value: stats.approved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Отклонено", value: stats.rejected, icon: FileText, color: "text-red-600 bg-red-50" },
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

      {/* Documents table */}
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Нет документов"
          description="Загрузите первый документ для члена федерации"
          actionLabel="Загрузить документ"
          actionHref="/documents/upload"
        />
      ) : (
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Документ</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Тип</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Член федерации</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Размер</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Статус</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Проверил</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Загружен</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[200px]">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium">{doc.member.fullName}</p>
                        <p className="text-xs text-muted-foreground">{doc.member.memberId}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{formatFileSize(doc.fileSize)}</span>
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        variant={DOCUMENT_STATUS_VARIANT[doc.status]}
                        label={DOCUMENT_STATUS_LABELS[doc.status]}
                      />
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {doc.reviewedBy?.fullName || "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(doc.createdAt)}
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
