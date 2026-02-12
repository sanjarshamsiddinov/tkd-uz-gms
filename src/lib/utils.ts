import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, fmt: string = 'dd.MM.yyyy') {
  return format(new Date(date), fmt, { locale: ru })
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: ru })
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function generateMemberId(lastId: number): string {
  return `UZB-${String(lastId + 1).padStart(4, '0')}`
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
