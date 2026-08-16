const {PrismaClient} = require('@prisma/client')

const c = new PrismaClient()

async function main() {
  try {
    // Try to find the users table via raw SQL
    const result = await c.$executeRaw`SELECT COUNT(*) as cnt FROM "users"`
    console.log('Users table exists, count:', result)
  } catch (error) {
    console.log('Users table error:', error.message)
  }
  
  try {
    const result = await c.$executeRaw`SELECT COUNT(*) as cnt FROM "categories"`
    console.log('Categories table exists, count:', result)
  } catch (error) {
    console.log('Categories table error:', error.message)
  }
  
  try {
    const result = await c.$executeRaw`SELECT COUNT(*) as cnt FROM "products"`
    console.log('Products table exists, count:', result)
  } catch (error) {
    console.log('Products table error:', error.message)
  }
  
  await c.$disconnect()
}

main()