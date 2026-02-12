import type { UserRole } from '@prisma/client'

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  regionId: string | null
  clubId: string | null
  memberId: string | null
  avatarUrl: string | null
}

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

export interface PageProps {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
