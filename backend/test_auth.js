const {PrismaClient} = require('@prisma/client')

const c = new PrismaClient()

async function main() {
  try {
    await c.$connect()
    console.log('Connected OK')
    
    // Try to find a user
    const user = await c.user.findFirst({ where: { email: 'admin@shopsphere.local' } })
    if (user) {
      console.log('Found user:', user.email, 'role:', user.role)
    } else {
      console.log('No user found with that email')
      // List all users
      const allUsers = await c.user.findMany()
      console.log('All users:', allUsers.length)
    }
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await c.$disconnect()
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })