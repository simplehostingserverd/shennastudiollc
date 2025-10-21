const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: 'shenna@shennastudio.com' },
    })

    if (existingUser) {
      console.log('❌ Admin user already exists with email: shenna@shennastudio.com')
      console.log('Updating role to admin...')
      
      await prisma.user.update({
        where: { email: 'shenna@shennastudio.com' },
        data: { 
          role: 'admin',
          password: '$2b$10$2HnC5skamI/SmYNkWhDD4eoHJ3CL5eL2Q2OmqZeFk1NXHxoO7or2K'
        },
      })
      
      console.log('✅ User updated to admin role')
      console.log('\n📧 Email: shenna@shennastudio.com')
      console.log('🔑 Password: Shenna2025!OceanConservation#Admin')
      console.log('\n🌐 Login at: https://yourdomain.com/admin/login')
      return
    }

    const admin = await prisma.user.create({
      data: {
        email: 'shenna@shennastudio.com',
        name: 'Shenna',
        password: '$2b$10$2HnC5skamI/SmYNkWhDD4eoHJ3CL5eL2Q2OmqZeFk1NXHxoO7or2K',
        role: 'admin',
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('\n📧 Email:', admin.email)
    console.log('👤 Name:', admin.name)
    console.log('🔑 Password: Shenna2025!OceanConservation#Admin')
    console.log('🎭 Role:', admin.role)
    console.log('\n🌐 Login at: https://yourdomain.com/admin/login')
    console.log('\n⚠️  IMPORTANT: Change your password after first login!')
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    
    if (error.code === 'P2002') {
      console.log('\nUser with this email already exists.')
      console.log('Try deleting the existing user first or use a different email.')
    }
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
