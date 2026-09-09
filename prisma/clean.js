const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning all old demo data from Masroofi database...')

  // Delete everything in cascade order
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.lifeGoal.deleteMany()
  await prisma.monthlyReview.deleteMany()
  await prisma.monthlyPlan.deleteMany()
  await prisma.commitment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.category.deleteMany()
  await prisma.account.deleteMany()
  await prisma.userSettings.deleteMany()
  await prisma.user.deleteMany()

  console.log('✨ All old data deleted successfully!')

  // Create clean initial user with zero data
  const user = await prisma.user.create({
    data: {
      name: 'أحمد محمود',
      email: 'user@masroofi.local',
      password: 'default_password',
      settings: {
        create: {
          language: 'ar',
          theme: 'system',
          currency: 'EGP',
        },
      },
      categories: {
        create: [
          { name: 'الراتب الأساسي', type: 'income', icon: 'Briefcase', color: '#2d5a4c' },
          { name: 'أعمال حرة', type: 'income', icon: 'Laptop', color: '#4a6b82' },
          { name: 'طعام ومطاعم', type: 'expense', icon: 'Utensils', color: '#c5a059' },
          { name: 'سكن وفواتير', type: 'expense', icon: 'Home', color: '#4a6b82' },
          { name: 'مواصلات وبنزين', type: 'expense', icon: 'Car', color: '#6b5b7b' },
          { name: 'تسوق وترفيه', type: 'expense', icon: 'ShoppingBag', color: '#c87d75' },
          { name: 'صحة ورعاية', type: 'expense', icon: 'HeartPulse', color: '#c87d75' },
        ],
      },
    },
  })

  console.log('✅ Clean default user created with ID:', user.id)
}

main()
  .catch((e) => {
    console.error('❌ Error cleaning database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
