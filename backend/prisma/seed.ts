import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

const seedUsers = [
  {
    name: 'ShopSphere Admin',
    email: 'admin@shopsphere.local',
    password: 'Admin@12345',
    role: 'ADMIN' as const,
  },
  {
    name: 'Demo Customer',
    email: 'customer@shopsphere.local',
    password: 'Customer@12345',
    role: 'CUSTOMER' as const,
  },
]

async function main() {
  for (const seed of seedUsers) {
    const existing = await prisma.user.findUnique({ where: { email: seed.email } })
    if (existing) {
      console.log(`Seed user already exists, skipping: ${seed.email}`)
      continue
    }

    const passwordHash = await bcrypt.hash(seed.password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        name: seed.name,
        email: seed.email,
        passwordHash,
        role: seed.role,
      },
    })
    console.log(`Seeded user: ${user.email} (${user.role})`)
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })