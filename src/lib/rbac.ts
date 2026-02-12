import { UserRole } from "@prisma/client"
import type { SessionUser } from "@/types"

type Action =
  | "members.view"
  | "members.create"
  | "members.edit"
  | "members.delete"
  | "members.verify"
  | "documents.view"
  | "documents.upload"
  | "documents.review"
  | "licenses.view"
  | "licenses.approve_docs"
  | "licenses.approve_final"
  | "competitions.create"
  | "competitions.edit"
  | "competitions.register"
  | "registrations.approve"
  | "brackets.generate"
  | "brackets.edit"
  | "matches.result"
  | "rankings.view"
  | "rankings.config"
  | "organizations.manage_regions"
  | "organizations.manage_clubs"
  | "audit.view"
  | "settings.manage"

const permissions: Record<UserRole, Action[]> = {
  SUPER_ADMIN: [
    "members.view", "members.create", "members.edit", "members.delete", "members.verify",
    "documents.view", "documents.upload", "documents.review",
    "licenses.view", "licenses.approve_docs", "licenses.approve_final",
    "competitions.create", "competitions.edit", "competitions.register", "registrations.approve",
    "brackets.generate", "brackets.edit", "matches.result",
    "rankings.view", "rankings.config",
    "organizations.manage_regions", "organizations.manage_clubs",
    "audit.view", "settings.manage",
  ],
  FED_ADMIN: [
    "members.view", "members.create", "members.edit", "members.delete", "members.verify",
    "documents.view", "documents.upload", "documents.review",
    "licenses.view", "licenses.approve_docs", "licenses.approve_final",
    "competitions.create", "competitions.edit", "competitions.register", "registrations.approve",
    "brackets.generate", "brackets.edit", "matches.result",
    "rankings.view", "rankings.config",
    "organizations.manage_regions", "organizations.manage_clubs",
    "audit.view",
  ],
  REGION_ADMIN: [
    "members.view", "members.create", "members.edit",
    "documents.view", "documents.upload", "documents.review",
    "licenses.view", "licenses.approve_docs",
    "competitions.register",
    "rankings.view",
    "organizations.manage_clubs",
  ],
  COACH: [
    "members.view", "members.create", "members.edit",
    "competitions.register",
    "rankings.view",
  ],
  JUDGE: [
    "brackets.generate", "brackets.edit", "matches.result",
    "rankings.view",
  ],
  ATHLETE: [
    "documents.view", "documents.upload",
    "licenses.view",
    "rankings.view",
  ],
}

export function hasPermission(role: UserRole, action: Action): boolean {
  return permissions[role]?.includes(action) ?? false
}

export function canAccess(user: SessionUser, action: Action): boolean {
  return hasPermission(user.role, action)
}

/**
 * Get Prisma where filter for row-level security
 */
export function getMemberFilter(user: SessionUser) {
  switch (user.role) {
    case "SUPER_ADMIN":
    case "FED_ADMIN":
      return {}
    case "REGION_ADMIN":
      return { regionId: user.regionId }
    case "COACH":
      return { clubId: user.clubId }
    case "ATHLETE":
      return { id: user.memberId }
    default:
      return { id: "NONE" }
  }
}

export function getDocumentFilter(user: SessionUser) {
  switch (user.role) {
    case "SUPER_ADMIN":
    case "FED_ADMIN":
      return {}
    case "REGION_ADMIN":
      return { member: { regionId: user.regionId } }
    case "ATHLETE":
      return { member: { id: user.memberId } }
    default:
      return { id: "NONE" }
  }
}

export function getClubFilter(user: SessionUser) {
  switch (user.role) {
    case "SUPER_ADMIN":
    case "FED_ADMIN":
      return {}
    case "REGION_ADMIN":
      return { regionId: user.regionId }
    default:
      return { id: "NONE" }
  }
}
