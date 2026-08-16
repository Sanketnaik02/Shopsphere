const {PrismaClient} = require('@prisma/client')

const c = new PrismaClient()

async function main() {
  // Check all tables
  const tables = await c.$executeRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  console.log('Tables:', tables)
  
  // Check users structure
  try {
    const users = await c.$executeRaw`SELECT * FROM "users" LIMIT 1`
    console.log('Users data:', users)
  } catch (e) {
    console.log('Users data error:', e.message)
  }
  
  // Check user count
  const userCount = await c.$executeRaw`SELECT COUNT(*) as cnt FROM "users"`
  console.log('User count:', userCount)
  
  // Check categories
  const catCount = await c.category.count()
  console.log('Categories count:', catCount)
  
  // Check products
  const prodCount = await c.product.count()
  console.log('Products count:', prodCount)
  
  // Check category details
  const cats = await c.category.findMany()
  console.log('Categories:', cats)
  
  // Check product details
  const products = await c.product.findMany({take: 3})
  console.log('Products (first 3):', products)
}

main()