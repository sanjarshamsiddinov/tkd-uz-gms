import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface AuditLogInput {
  userId: string
  action: string
  entityType: string
  entityId: string
  details?: Prisma.InputJsonValue
  ipAddress?: string
}

export async function createAuditLog(input: AuditLogInput) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      details: input.details ?? Prisma.JsonNull,
      ipAddress: input.ipAddress ?? null,
    },
  })
}
