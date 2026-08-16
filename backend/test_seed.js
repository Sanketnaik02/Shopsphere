const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prismaClient = new PrismaClient()

async function main() {
  const adminEmail = 'admin@shopsphere.local'
  const customerEmail = 'customer@shopsphere.local'

  const adminSelectSql = 'SELECT COUNT(*) as cnt FROM "users" WHERE email = \'admin@shopsphere.local\''
  const adminExists = await prismaClient.$queryRawUnsafe(adminSelectSql)
  console.log('Admin exists:', adminExists)

  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10)
  const adminInsertSql = "INSERT INTO \"users\" (name, email, passwordHash, role) VALUES ('ShopSphere Admin', 'admin@shopsphere.local', '" + adminPasswordHash + "', 'ADMIN')"
  await prismaClient.$executeRawUnsafe(adminInsertSql)
  console.log('Seeded admin')
}

main()