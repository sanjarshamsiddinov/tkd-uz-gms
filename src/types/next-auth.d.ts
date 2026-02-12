import { UserRole } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      regionId: string | null
      clubId: string | null
      memberId: string | null
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
    regionId: string | null
    clubId: string | null
    memberId: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    regionId: string | null
    clubId: string | null
    memberId: string | null
  }
}
