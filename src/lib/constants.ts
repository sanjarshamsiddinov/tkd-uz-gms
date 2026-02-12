import { BeltRank, MemberType, MemberStatus, LicenseStatus, DocumentStatus, CompetitionStatus, RegistrationStatus, MatchStatus, AgeGroup, CompetitionType, Gender, UserRole } from '@prisma/client'

// ============================================================
// BELT RANKS
// ============================================================

export const BELT_RANK_LABELS: Record<BeltRank, string> = {
  GYP_10: '10 гып (Белый)',
  GYP_9: '9 гып (Бело-жёлтый)',
  GYP_8: '8 гып (Жёлтый)',
  GYP_7: '7 гып (Жёлто-зелёный)',
  GYP_6: '6 гып (Зелёный)',
  GYP_5: '5 гып (Зелёно-синий)',
  GYP_4: '4 гып (Синий)',
  GYP_3: '3 гып (Сине-красный)',
  GYP_2: '2 гып (Красный)',
  GYP_1: '1 гып (Красно-чёрный)',
  DAN_1: '1 дан',
  DAN_2: '2 дан',
  DAN_3: '3 дан',
  DAN_4: '4 дан',
  DAN_5: '5 дан',
  DAN_6: '6 дан',
  DAN_7: '7 дан',
  DAN_8: '8 дан',
  DAN_9: '9 дан',
}

export const BELT_RANK_COLORS: Record<BeltRank, { bg: string; text: string; border?: string }> = {
  GYP_10: { bg: 'bg-white', text: 'text-gray-700', border: 'border-2 border-gray-300' },
  GYP_9: { bg: 'bg-white', text: 'text-gray-700', border: 'border-2 border-yellow-300' },
  GYP_8: { bg: 'bg-yellow-400', text: 'text-black' },
  GYP_7: { bg: 'bg-yellow-400/70', text: 'text-black', border: 'border-2 border-green-500' },
  GYP_6: { bg: 'bg-green-500', text: 'text-white' },
  GYP_5: { bg: 'bg-green-500/70', text: 'text-white', border: 'border-2 border-blue-500' },
  GYP_4: { bg: 'bg-blue-600', text: 'text-white' },
  GYP_3: { bg: 'bg-blue-600/70', text: 'text-white', border: 'border-2 border-red-500' },
  GYP_2: { bg: 'bg-red-600', text: 'text-white' },
  GYP_1: { bg: 'bg-red-600/70', text: 'text-white', border: 'border-2 border-black' },
  DAN_1: { bg: 'bg-black', text: 'text-white' },
  DAN_2: { bg: 'bg-black', text: 'text-white' },
  DAN_3: { bg: 'bg-black', text: 'text-white' },
  DAN_4: { bg: 'bg-black', text: 'text-white' },
  DAN_5: { bg: 'bg-black', text: 'text-white' },
  DAN_6: { bg: 'bg-black', text: 'text-white' },
  DAN_7: { bg: 'bg-black', text: 'text-white' },
  DAN_8: { bg: 'bg-black', text: 'text-white' },
  DAN_9: { bg: 'bg-black', text: 'text-white' },
}

// Numeric order for belt comparison
export const BELT_RANK_ORDER: Record<BeltRank, number> = {
  GYP_10: 0,
  GYP_9: 1,
  GYP_8: 2,
  GYP_7: 3,
  GYP_6: 4,
  GYP_5: 5,
  GYP_4: 6,
  GYP_3: 7,
  GYP_2: 8,
  GYP_1: 9,
  DAN_1: 10,
  DAN_2: 11,
  DAN_3: 12,
  DAN_4: 13,
  DAN_5: 14,
  DAN_6: 15,
  DAN_7: 16,
  DAN_8: 17,
  DAN_9: 18,
}

// ============================================================
// STATUS LABELS
// ============================================================

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  PENDING: 'На рассмотрении',
  ACTIVE: 'Активен',
  SUSPENDED: 'Приостановлен',
  DISQUALIFIED: 'Дисквалифицирован',
  EXPIRED: 'Истёк',
}

export const LICENSE_STATUS_LABELS: Record<LicenseStatus, string> = {
  PENDING: 'На рассмотрении',
  DOCS_APPROVED: 'Документы утверждены',
  APPROVED: 'Утверждена',
  EXPIRED: 'Истекла',
  SUSPENDED: 'Приостановлена',
  REJECTED: 'Отклонена',
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  UPLOADED: 'Загружен',
  UNDER_REVIEW: 'На проверке',
  APPROVED: 'Утверждён',
  REJECTED: 'Отклонён',
}

export const COMPETITION_STATUS_LABELS: Record<CompetitionStatus, string> = {
  DRAFT: 'Черновик',
  REGISTRATION_OPEN: 'Регистрация открыта',
  REGISTRATION_CLOSED: 'Регистрация закрыта',
  IN_PROGRESS: 'В процессе',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
}

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  PENDING: 'На рассмотрении',
  APPROVED: 'Утверждена',
  REJECTED: 'Отклонена',
  WITHDRAWN: 'Отозвана',
}

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  SCHEDULED: 'Запланирован',
  IN_PROGRESS: 'В процессе',
  COMPLETED: 'Завершён',
}

// ============================================================
// STATUS BADGE STYLES
// ============================================================

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'blue'

export const STATUS_VARIANTS: Record<StatusVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-500 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
}

export const MEMBER_STATUS_VARIANT: Record<MemberStatus, StatusVariant> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'warning',
  DISQUALIFIED: 'danger',
  EXPIRED: 'neutral',
}

export const LICENSE_STATUS_VARIANT: Record<LicenseStatus, StatusVariant> = {
  APPROVED: 'success',
  DOCS_APPROVED: 'info',
  PENDING: 'warning',
  EXPIRED: 'neutral',
  SUSPENDED: 'warning',
  REJECTED: 'danger',
}

export const DOCUMENT_STATUS_VARIANT: Record<DocumentStatus, StatusVariant> = {
  APPROVED: 'success',
  UNDER_REVIEW: 'info',
  UPLOADED: 'warning',
  REJECTED: 'danger',
}

export const COMPETITION_STATUS_VARIANT: Record<CompetitionStatus, StatusVariant> = {
  DRAFT: 'neutral',
  REGISTRATION_OPEN: 'success',
  REGISTRATION_CLOSED: 'warning',
  IN_PROGRESS: 'blue',
  COMPLETED: 'success',
  CANCELLED: 'danger',
}

// ============================================================
// TYPE LABELS
// ============================================================

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  ATHLETE: 'Спортсмен',
  COACH: 'Тренер',
  REFEREE: 'Судья',
  OFFICIAL: 'Официальное лицо',
}

export const COMPETITION_TYPE_LABELS: Record<CompetitionType, string> = {
  CHAMPIONSHIP: 'Чемпионат',
  CUP: 'Кубок',
  OPEN: 'Открытый турнир',
  QUALIFIER: 'Отборочный',
  INTERNATIONAL: 'Международный',
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  CHILDREN: 'Дети (до 12)',
  CADETS: 'Кадеты (12-14)',
  JUNIORS: 'Юниоры (15-17)',
  SENIORS: 'Взрослые (18+)',
  VETERANS: 'Ветераны (35+)',
}

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: 'Мужской',
  FEMALE: 'Женский',
}

export const GENDER_SHORT: Record<Gender, string> = {
  MALE: 'М',
  FEMALE: 'Ж',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Суперадмин',
  FED_ADMIN: 'Администратор федерации',
  REGION_ADMIN: 'Администратор области',
  COACH: 'Тренер',
  JUDGE: 'Судья',
  ATHLETE: 'Спортсмен',
}

// ============================================================
// NAVIGATION
// ============================================================

export const NAV_ITEMS = [
  { label: 'Главная', href: '/', icon: 'LayoutDashboard' as const },
  { label: 'Члены федерации', href: '/members', icon: 'Users' as const },
  { label: 'Лицензии', href: '/licenses', icon: 'FileCheck' as const },
  { label: 'Документы', href: '/documents', icon: 'FileText' as const },
  { label: 'Соревнования', href: '/competitions', icon: 'Trophy' as const },
  { label: 'Жеребьёвка', href: '/draws', icon: 'GitBranch' as const },
  { label: 'Рейтинги', href: '/rankings', icon: 'BarChart3' as const },
] as const

export const NAV_ITEMS_ORG = [
  { label: 'Области', href: '/organizations/regions', icon: 'Map' as const },
  { label: 'Клубы', href: '/organizations/clubs', icon: 'Building2' as const },
] as const

export const NAV_ITEMS_SETTINGS = [
  { label: 'Настройки', href: '/settings', icon: 'Settings' as const },
  { label: 'Журнал действий', href: '/settings/audit-log', icon: 'History' as const },
] as const
