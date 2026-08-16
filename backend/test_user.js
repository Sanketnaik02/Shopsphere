const { PrismaClient } = require('@prisma/client')

const c = new PrismaClient()

async function main() {
  try {
    await c.$connect()
    console.log('Connected to database')
    
    // Test admin user
    const adminUser = await c.user.findFirst({ where: { email: 'admin@shopsphere.local' } })
    console.log('Admin user:', adminUser ? adminUser.email + ' (' + adminUser.role + ')' : 'not found')
    
    // Test customer user
    const customerUser = await c.user.findFirst({ where: { email: 'customer@shopsphere.local' } })
    console.log('Customer user:', customerUser ? customerUser.email + ' (' + customerUser.role + ')' : 'not found')
    
    // If neither found, list all users
    if (!adminUser && !customerUser) {
      const allUsers = await c.user.findMany()
      console.log('Total users in DB:', allUsers.length)
      allUsers.forEach(u => console.log(' -', u.email, 'role:', u.role))
    }
  } catch (e) {
    console.error('ERROR:', e.message)
  } finally {
    await c.$disconnect()
  }
}

main()