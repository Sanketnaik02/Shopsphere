import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

async function main() {
  // Seed categories idempotently - create or update, and capture IDs
  const categoryNames = ['Electronics', 'Mobiles', 'Laptops', 'Accessories', 'Home Appliances', 'Gaming']
  const categoryMap: Record<string, string> = {}

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const existing = await prismaClient.category.findUnique({ where: { slug } })

    const category = await prismaClient.category.upsert({
      where: { slug },
      update: {
        name,
        description: `Description for ${name}`,
        isActive: true,
      },
      create: {
        name,
        slug,
        description: `Description for ${name}`,
        isActive: true,
      },
    })

    categoryMap[name] = category.id
    console.log(`Seeded category: ${name} (${category.id})`)
  }

  // Seed products idempotently
  // Use name as the unique identifier for upsert; skip if already exists
  const productsData = [
    // Active products - Mobiles
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Apple flagship smartphone with titanium design',
      price: 1299900,
      brand: 'Apple',
      category: 'Mobiles',
      imageUrl: 'https://example.com/iphone-15-pro.jpg',
      stock: 50,
      rating: 4.8,
      isActive: true,
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Samsung flagship Android smartphone',
      price: 1099900,
      brand: 'Samsung',
      category: 'Mobiles',
      imageUrl: 'https://example.com/galaxy-s24.jpg',
      stock: 35,
      rating: 4.5,
      isActive: true,
    },

    // Active products - Laptops
    {
      name: 'MacBook Pro 16-inch',
      slug: 'macbook-pro-16',
      description: 'Apple professional laptop with M3 Pro chip',
      price: 2499900,
      brand: 'Apple',
      category: 'Laptops',
      imageUrl: 'https://example.com/macbook-pro-16.jpg',
      stock: 20,
      rating: 4.7,
      isActive: true,
    },
    {
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      description: 'Dell premium ultrabook',
      price: 1399900,
      brand: 'Dell',
      category: 'Laptops',
      imageUrl: 'https://example.com/dell-xps-13.jpg',
      stock: 25,
      rating: 4.3,
      isActive: true,
    },
    {
      name: 'Gaming Laptop',
      slug: 'gaming-laptop',
      description: 'High-performance gaming laptop with RTX 4060',
      price: 1899900,
      brand: 'ASUS',
      category: 'Laptops',
      imageUrl: 'https://example.com/asus-gaming-laptop.jpg',
      stock: 15,
      rating: 4.6,
      isActive: true,
    },

    // Active products - Accessories
    {
      name: 'Noise Cancelling Headphones',
      slug: 'noise-cancelling-headphones',
      description: 'Wireless headphones with active noise cancellation',
      price: 399900,
      brand: 'Sony',
      category: 'Accessories',
      imageUrl: 'https://example.com/sony-headphones.jpg',
      stock: 45,
      rating: 4.4,
      isActive: true,
    },
    {
      name: 'Smart Watch',
      slug: 'smart-watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 249900,
      brand: 'Apple',
      category: 'Accessories',
      imageUrl: 'https://example.com/apple-watch.jpg',
      stock: 60,
      rating: 4.3,
      isActive: true,
    },
    {
      name: 'Compact Keyboard',
      slug: 'compact-keyboard',
      description: 'Compact mechanical keyboard',
      price: 99900,
      brand: 'Keychron',
      category: 'Accessories',
      imageUrl: 'https://example.com/keychron-keyboard.jpg',
      stock: 2,
      rating: 4.1,
      isActive: true,
    },
    {
      name: 'Portable Charger 10000mAh',
      slug: 'portable-charger-10000',
      description: 'High-capacity power bank',
      price: 129900,
      brand: 'Xiaomi',
      category: 'Accessories',
      imageUrl: 'https://example.com/xiaomi-powerbank.jpg',
      stock: 3,
      rating: 4.0,
      isActive: true,
    },
    {
      name: 'Budget Phone Case',
      slug: 'budget-phone-case',
      description: 'Basic protective phone case',
      price: 29900,
      brand: 'Generic',
      category: 'Accessories',
      imageUrl: 'https://example.com/generic-case.jpg',
      stock: 100,
      rating: 3.8,
      isActive: true,
    },
    {
      name: 'Mechanical Keyboard',
      slug: 'mechanical-keyboard',
      description: 'RGB mechanical gaming keyboard',
      price: 159900,
      brand: 'Razer',
      category: 'Accessories',
      imageUrl: 'https://example.com/razer-keyboard.jpg',
      stock: 25,
      rating: 4.7,
      isActive: true,
    },

    // Active products - Electronics
    {
      name: 'Camera Mirrorless',
      slug: 'camera-mirrorless',
      description: 'Mirrorless camera with interchangeable lenses',
      price: 899900,
      brand: 'Sony',
      category: 'Electronics',
      imageUrl: 'https://example.com/sony-mirrorless.jpg',
      stock: 30,
      rating: 4.5,
      isActive: true,
    },
    {
      name: '4K Television',
      slug: '4k-television',
      description: '55-inch 4K Smart TV',
      price: 8999900,
      brand: 'Samsung',
      category: 'Electronics',
      imageUrl: 'https://example.com/samsung-4k-tv.jpg',
      stock: 8,
      rating: 4.8,
      isActive: true,
    },

    // Active products - Home Appliances
    {
      name: 'Electric Kettle',
      slug: 'electric-kettle',
      description: 'Fast-boiling electric kettle',
      price: 499900,
      brand: 'Philips',
      category: 'Home Appliances',
      imageUrl: 'https://example.com/philips-kettle.jpg',
      stock: 40,
      rating: 4.2,
      isActive: true,
    },
    {
      name: 'Smart Home Bulb',
      slug: 'smart-home-bulb',
      description: 'WiFi-enabled LED light bulb',
      price: 19900,
      brand: 'Philips Hue',
      category: 'Home Appliances',
      imageUrl: 'https://example.com/hue-bulb.jpg',
      stock: 120,
      rating: 4.4,
      isActive: true,
    },

    // Active products - Gaming
    {
      name: 'Gaming Console',
      slug: 'gaming-console',
      description: 'Latest generation gaming console',
      price: 549900,
      brand: 'Sony',
      category: 'Gaming',
      imageUrl: 'https://example.com/playstation-5.jpg',
      stock: 35,
      rating: 4.7,
      isActive: true,
    },

    // Inactive product
    {
      name: 'Discontinued Trackpad',
      slug: 'discontinued-trackpad',
      description: 'Old generation trackpad',
      price: 149900,
      brand: 'Apple',
      category: 'Accessories',
      imageUrl: 'https://example.com/apple-trackpad.jpg',
      stock: 100,
      rating: 3.2,
      isActive: false,
    },

    // Zero-stock product
    {
      name: 'Out of Stock Gaming Mouse',
      slug: 'out-of-stock-gaming-mouse',
      description: 'High-performance gaming mouse',
      price: 79900,
      brand: 'Logitech',
      category: 'Accessories',
      imageUrl: 'https://example.com/logitech-mouse.jpg',
      stock: 0,
      rating: 4.2,
      isActive: true,
    },

    // Low-stock products (stock between 1 and 5)
    {
      name: 'Compact Keyboard (low stock)',
      slug: 'compact-keyboard-low',
      description: 'Compact mechanical keyboard (low stock)',
      price: 99900,
      brand: 'Keychron',
      category: 'Accessories',
      imageUrl: 'https://example.com/keychron-keyboard.jpg',
      stock: 1,
      rating: 4.1,
      isActive: true,
    },
    {
      name: 'Portable Charger 10000mAh (low stock)',
      slug: 'portable-charger-10000-low',
      description: 'High-capacity power bank (low stock)',
      price: 129900,
      brand: 'Xiaomi',
      category: 'Accessories',
      imageUrl: 'https://example.com/xiaomi-powerbank.jpg',
      stock: 4,
      rating: 4.0,
      isActive: true,
    },

    // Additional price variety
    {
      name: 'Premium Leather Bag',
      slug: 'premium-leather-bag',
      description: 'Genuine leather laptop bag',
      price: 599900,
      brand: 'Gucci',
      category: 'Accessories',
      imageUrl: 'https://example.com/gucci-bag.jpg',
      stock: 15,
      rating: 4.6,
      isActive: true,
    },
  ]

  for (const product of productsData) {
    const catId = categoryMap[product.category]

    // Use upsert with slug as unique identifier
    await prismaClient.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        categoryId: catId,
        imageUrl: product.imageUrl,
        stock: product.stock,
        rating: product.rating,
        isActive: product.isActive,
      },
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        categoryId: catId,
        imageUrl: product.imageUrl,
        stock: product.stock,
        rating: product.rating,
        isActive: product.isActive,
        slug: product.slug,
      },
    })
    console.log(`Seeded product: ${product.name} (${product.category})`)
  }

  console.log('Seed completed!')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })