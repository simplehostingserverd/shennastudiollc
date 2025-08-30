import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear old data
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: "oceanlover@example.com",
      name: "Ocean Lover",
      password: "$2a$10$Kix6eKJPH4j9Z6hV8SGZ6eRC9h5g/3Z9bIlvX68XZfSeCJApXZjV2", // bcrypt hash for "password123"
    },
  })

  // Add ocean-themed products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Sea Turtle Mug",
        description: "Ceramic mug with a hand-painted sea turtle design.",
        price: 1999, // in cents ($19.99)
        imageUrl: "https://res.cloudinary.com/demo/image/upload/turtle-mug.jpg",
      },
      {
        name: "Shell Necklace",
        description: "Handmade seashell necklace, perfect for beach lovers.",
        price: 2999,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/shell-necklace.jpg",
      },
      {
        name: "Ocean Wave Poster",
        description: "High-quality print of a crashing ocean wave.",
        price: 2499,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/ocean-wave-poster.jpg",
      },
      {
        name: "Starfish Earrings",
        description: "Elegant earrings shaped like tiny starfish.",
        price: 1599,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/starfish-earrings.jpg",
      },
    ],
  })

  console.log(`🌊 Seeded DB with ${products.count} products and 1 user`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
