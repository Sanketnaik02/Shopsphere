const {PrismaClient} = require('@prisma/client')

const c = new PrismaClient()

async function main() {
  const users = await c.$executeRaw`SELECT COUNT(*) as cnt FROM "users"`
  console.log('Users count:', users)
  
  const cats = await c.category.count()
  console.log('Categories count:', cats)
  
  const products = await c.product.count()
  console.log('Products count:', products)
  
  const active = await c.product.count({where: {isActive: true}})
  console.log('Active products:', active)
  
  const inactive = await c.product.count({where: {isActive: false}})
  console.log('Inactive products:', inactive)
  
  const zeroStock = await c.product.count({where: {stock: 0}})
  console.log('Zero-stock products:', zeroStock)
  
  const lowStock = await c.product.count({where: {stock: {gt: 0, lte: 5}}})
  console.log('Low-stock products:', lowStock)
  
  await c.$disconnect()
}

main()