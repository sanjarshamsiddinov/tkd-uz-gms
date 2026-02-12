import { PrismaClient, UserRole, CompetitionType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const regions = [
  { name: 'город Ташкент', code: 'TAS' },
  { name: 'Ташкентская область', code: 'TASO' },
  { name: 'Самаркандская область', code: 'SAM' },
  { name: 'Бухарская область', code: 'BUX' },
  { name: 'Ферганская область', code: 'FER' },
  { name: 'Андижанская область', code: 'AND' },
  { name: 'Наманганская область', code: 'NAM' },
  { name: 'Кашкадарьинская область', code: 'KAS' },
  { name: 'Сурхандарьинская область', code: 'SUR' },
  { name: 'Хорезмская область', code: 'XOR' },
  { name: 'Навоийская область', code: 'NAV' },
  { name: 'Джизакская область', code: 'JIZ' },
  { name: 'Сырдарьинская область', code: 'SIR' },
  { name: 'Каракалпакстан', code: 'KAR' },
]

const rankingConfigs = [
  {
    competitionType: CompetitionType.CHAMPIONSHIP,
    place1Points: 100,
    place2Points: 70,
    place3Points: 50,
    place5Points: 20,
  },
  {
    competitionType: CompetitionType.CUP,
    place1Points: 70,
    place2Points: 50,
    place3Points: 30,
    place5Points: 10,
  },
  {
    competitionType: CompetitionType.OPEN,
    place1Points: 50,
    place2Points: 30,
    place3Points: 20,
    place5Points: 0,
  },
  {
    competitionType: CompetitionType.QUALIFIER,
    place1Points: 60,
    place2Points: 40,
    place3Points: 25,
    place5Points: 10,
  },
  {
    competitionType: CompetitionType.INTERNATIONAL,
    place1Points: 120,
    place2Points: 90,
    place3Points: 60,
    place5Points: 30,
  },
]

async function main() {
  console.log('Seeding database...')

  // Create regions
  for (const region of regions) {
    await prisma.region.upsert({
      where: { code: region.code },
      update: {},
      create: region,
    })
  }
  console.log(`Created ${regions.length} regions`)

  // Create super admin
  const passwordHash = await hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@tkd.uz' },
    update: {},
    create: {
      email: 'admin@tkd.uz',
      passwordHash,
      fullName: 'Администратор системы',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  })
  console.log('Created super admin: admin@tkd.uz')

  // Create ranking configs
  for (const config of rankingConfigs) {
    await prisma.rankingConfig.upsert({
      where: { competitionType: config.competitionType },
      update: config,
      create: config,
    })
  }
  console.log(`Created ${rankingConfigs.length} ranking configs`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
