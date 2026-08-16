const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.$connect().then(() => {
  return prisma.user.findMany({})
}).then(users => {
  console.log('Users count:', users.length)
  console.log('Users:', JSON.stringify(users, null, 2))
  return prisma.$disconnect()
}).catch(err => {
  console.error('Error:', err)
  return prisma.$disconnect().then(() => { process.exit(1) })
})