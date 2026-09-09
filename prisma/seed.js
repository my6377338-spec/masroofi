const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting full Life & Financial OS seed for Masroofi...')

  // Clean old data in correct order
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

  // Create primary user
  const user = await prisma.user.create({
    data: {
      name: 'مروان سيد',
      email: 'user@masroofi.local',
      password: 'demo_password',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  })

  console.log('✅ User created:', user.name)

  // User Settings
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      language: 'ar',
      theme: 'system',
      currency: 'EGP',
    },
  })

  // Create Accounts (using elegant colors)
  const mainBank = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'البنك الأهلي المصري',
      type: 'bank',
      balance: 145000,
      currency: 'EGP',
      icon: 'Landmark',
      color: '#2d5a4c', // Muted Forest
    },
  })

  const creditCard = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'بطاقة CIB بلاتينيوم',
      type: 'credit_card',
      balance: -6800,
      currency: 'EGP',
      icon: 'CreditCard',
      color: '#c87d75', // Muted Rose
    },
  })

  const vodafoneCash = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'فودافون كاش',
      type: 'wallet',
      balance: 6200,
      currency: 'EGP',
      icon: 'Smartphone',
      color: '#c5a059', // Muted Gold
    },
  })

  const cashWallet = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'المحفظة الشخصية',
      type: 'cash',
      balance: 2400,
      currency: 'EGP',
      icon: 'Wallet',
      color: '#4a6b82', // Muted Blue
    },
  })

  const investmentAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'صندوق الاستثمار والتوفير',
      type: 'savings',
      balance: 195000,
      currency: 'EGP',
      icon: 'PiggyBank',
      color: '#6b5b7b', // Muted Violet
    },
  })

  console.log('✅ Accounts created')

  // Create Categories with refined calm muted colors
  const salaryCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'الراتب الأساسي',
      type: 'income',
      icon: 'Briefcase',
      color: '#2d5a4c',
    },
  })

  const freelanceCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'أعمال حرة ومستقلة',
      type: 'income',
      icon: 'Laptop',
      color: '#4a6b82',
    },
  })

  const investmentIncomeCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'عائد استثمارات',
      type: 'income',
      icon: 'TrendingUp',
      color: '#c5a059',
    },
  })

  const foodCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'طعام ومطاعم',
      type: 'expense',
      icon: 'Utensils',
      color: '#c5a059',
    },
  })

  const housingCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'سكن وفواتير',
      type: 'expense',
      icon: 'Home',
      color: '#4a6b82',
    },
  })

  const transportCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'مواصلات وبنزين',
      type: 'expense',
      icon: 'Car',
      color: '#6b5b7b',
    },
  })

  const shoppingCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'تسوق وترفيه',
      type: 'expense',
      icon: 'ShoppingBag',
      color: '#c87d75',
    },
  })

  const healthCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'صحة ورعاية طبية',
      type: 'expense',
      icon: 'HeartPulse',
      color: '#c87d75',
    },
  })

  const eduCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'تعليم وتطوير',
      type: 'expense',
      icon: 'GraduationCap',
      color: '#2d5a4c',
    },
  })

  const billsCat = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'التزامات واشتراكات',
      type: 'expense',
      icon: 'FileText',
      color: '#64748b',
    },
  })

  console.log('✅ Categories created')

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Previous Month Transactions
  const prevMonthTxData = [
    { type: 'income', category: salaryCat, account: mainBank, amount: 45000, desc: 'راتب الشهر الماضي', day: 1, tags: JSON.stringify(['ثابت']) },
    { type: 'income', category: freelanceCat, account: vodafoneCash, amount: 14000, desc: 'استشارة تقنية وتطوير web', day: 10, tags: JSON.stringify(['جانبي']) },
    { type: 'expense', category: housingCat, account: mainBank, amount: 9500, desc: 'إيجار المنزل والخدمات', day: 2, tags: JSON.stringify(['أساسي']) },
    { type: 'expense', category: billsCat, account: mainBank, amount: 1800, desc: 'فواتير الكهرباء والغاز', day: 4, tags: JSON.stringify(['فواتير']) },
    { type: 'expense', category: foodCat, account: cashWallet, amount: 4600, desc: 'مشتريات بقالة هايبرماركت', day: 7, tags: JSON.stringify(['طعام']) },
    { type: 'expense', category: transportCat, account: vodafoneCash, amount: 1600, desc: 'وقود ومصاريف السيارة', day: 9, tags: JSON.stringify(['سيارة']) },
    { type: 'expense', category: shoppingCat, account: creditCard, amount: 6200, desc: 'ملابس واحتياجات منزلية', day: 15, tags: JSON.stringify(['تسوق']) },
    { type: 'expense', category: healthCat, account: mainBank, amount: 2100, desc: 'كشف عيادة وفحوصات دورية', day: 18, tags: JSON.stringify(['صحة']) },
    { type: 'expense', category: eduCat, account: mainBank, amount: 3500, desc: 'ورشة عمل تصميم وتجربة المستخدم', day: 22, tags: JSON.stringify(['تطوير']) },
  ]

  for (const item of prevMonthTxData) {
    const txDate = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth(), item.day, 12, 0, 0)
    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: item.account.id,
        categoryId: item.category.id,
        amount: item.amount,
        type: item.type,
        description: item.desc,
        date: txDate,
        tags: item.tags,
      },
    })
  }

  // Current Month Transactions (Total Expenses = 7,000 EGP for demo)
  const currentMonthTxData = [
    { type: 'income', category: salaryCat, account: mainBank, amount: 45000, desc: 'الراتب الشهري الرئيسي', day: 1, tags: JSON.stringify(['راتب', 'أساسي']) },
    { type: 'income', category: freelanceCat, account: vodafoneCash, amount: 12000, desc: 'عائد الاستشارة التقنية', day: 8, tags: JSON.stringify(['فريلانس']) },

    { type: 'expense', category: foodCat, account: mainBank, amount: 2800, desc: 'مشتريات السوبرماركت والبقالة', day: 3, tags: JSON.stringify(['طعام']) },
    { type: 'expense', category: billsCat, account: vodafoneCash, amount: 1800, desc: 'فواتير الكهرباء والإنترنت', day: 5, tags: JSON.stringify(['فواتير']) },
    { type: 'expense', category: transportCat, account: cashWallet, amount: 1200, desc: 'بنزين ومصاريف الانتقالات', day: 7, tags: JSON.stringify(['مواصلات']) },
    { type: 'expense', category: foodCat, account: creditCard, amount: 1200, desc: 'مطاعم وجبات عائلية', day: 9, tags: JSON.stringify(['مطاعم']) },
  ]

  for (const item of currentMonthTxData) {
    const day = Math.min(item.day, now.getDate())
    const txDate = new Date(now.getFullYear(), now.getMonth(), day, 14, 30, 0)
    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: item.account.id,
        categoryId: item.category.id,
        amount: item.amount,
        type: item.type,
        description: item.desc,
        date: txDate,
        tags: item.tags,
      },
    })
  }

  // Budgets
  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: foodCat.id,
      amount: 9000,
      period: 'monthly',
      startDate: currentMonthStart,
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    },
  })

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: transportCat.id,
      amount: 3500,
      period: 'monthly',
      startDate: currentMonthStart,
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    },
  })

  await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: shoppingCat.id,
      amount: 6000,
      period: 'monthly',
      startDate: currentMonthStart,
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    },
  })

  // Smart Financial Goals
  const carGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      name: 'شراء سيارة جديدة',
      description: 'ادخار دفعة مقدمة لشراء سيارة عائلية حديثة موديل 2027',
      targetAmount: 450000,
      currentAmount: 180000,
      deadline: new Date(now.getFullYear() + 2, 5, 30),
      monthlyContribution: 12000,
      status: 'active',
      icon: 'Car',
      color: '#2d5a4c',
    },
  })

  const emergencyGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      name: 'صندوق الطوارئ والأمان',
      description: 'تغطية مصاريف المعيشة لمدة 6 أشهر للحالات الطارئة',
      targetAmount: 150000,
      currentAmount: 110000,
      deadline: new Date(now.getFullYear() + 1, 2, 31),
      monthlyContribution: 8000,
      status: 'active',
      icon: 'ShieldCheck',
      color: '#4a6b82',
    },
  })

  const travelGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      name: 'رحلة استكشافية إلى اليابان',
      description: 'سفر واستجمام وزيارة المعالم الثقافية والتكنولوجية',
      targetAmount: 85000,
      currentAmount: 52000,
      deadline: new Date(now.getFullYear() + 1, 8, 30),
      monthlyContribution: 4500,
      status: 'active',
      icon: 'Palmtree',
      color: '#c5a059',
    },
  })

  console.log('✅ Financial Goals created')

  // Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        userId: user.id,
        name: 'Netflix Premium 4K',
        amount: 320,
        billingCycle: 'monthly',
        nextBillingDate: new Date(now.getFullYear(), now.getMonth(), 25),
        category: 'ترفيه',
        icon: 'Tv',
        color: '#c87d75',
        active: true,
      },
      {
        userId: user.id,
        name: 'Spotify Family',
        amount: 140,
        billingCycle: 'monthly',
        nextBillingDate: new Date(now.getFullYear(), now.getMonth(), 28),
        category: 'ترفيه',
        icon: 'Music',
        color: '#2d5a4c',
        active: true,
      },
      {
        userId: user.id,
        name: 'ChatGPT Plus & Claude Pro',
        amount: 1950,
        billingCycle: 'monthly',
        nextBillingDate: new Date(now.getFullYear(), now.getMonth(), 15),
        category: 'إنتاجية وتطوير',
        icon: 'Cpu',
        color: '#6b5b7b',
        active: true,
      },
      {
        userId: user.id,
        name: 'iCloud 2TB Storage',
        amount: 180,
        billingCycle: 'monthly',
        nextBillingDate: new Date(now.getFullYear(), now.getMonth(), 20),
        category: 'تخزين سحابي',
        icon: 'Cloud',
        color: '#4a6b82',
        active: true,
      },
    ],
  })

  // Commitments (Bills & Debts)
  await prisma.commitment.createMany({
    data: [
      {
        userId: user.id,
        name: 'قسط العقار الشهري',
        type: 'debt',
        totalAmount: 360000,
        amount: 8500,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 5),
        recurrence: 'monthly',
        paid: true,
        icon: 'Home',
        color: '#4a6b82',
      },
      {
        userId: user.id,
        name: 'فاتورة الكهرباء والماء',
        type: 'bill',
        amount: 1450,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 28),
        recurrence: 'monthly',
        paid: false,
        icon: 'Zap',
        color: '#c5a059',
      },
      {
        userId: user.id,
        name: 'سداد بطاقة CIB بلاتينيوم',
        type: 'debt',
        totalAmount: 6800,
        amount: 6800,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 25),
        recurrence: 'monthly',
        paid: false,
        icon: 'CreditCard',
        color: '#c87d75',
      },
    ],
  })

  console.log('✅ Subscriptions and Commitments created')

  // Life Goals / Dreams (Vision system)
  const bizDream = await prisma.lifeGoal.create({
    data: {
      userId: user.id,
      title: 'إطلاق أستوديو المنتجات الرقمية الخاص',
      description: 'بناء وكالة برمجية ومتجر منتجات ذكاء اصطناعي تقدم حلولاً للمؤسسات والشركات الناشئة',
      category: 'career_business',
      targetDate: new Date(now.getFullYear() + 2, 0, 1),
      estimatedBudget: 300000,
      priority: 'high',
      status: 'in_progress',
      icon: 'Rocket',
      color: '#2d5a4c',
      milestones: {
        create: [
          { title: 'إعداد خطة العمل ودراسة الجدوى المالية', targetDate: new Date(now.getFullYear(), now.getMonth() + 2, 1), cost: 15000, completed: true },
          { title: 'تسجيل العلامة التجارية والكيان القانوني', targetDate: new Date(now.getFullYear(), now.getMonth() + 5, 1), cost: 35000, completed: false },
          { title: 'تجهيز البنية التحتية وتوظيف أول مهندسين', targetDate: new Date(now.getFullYear() + 1, 0, 1), cost: 150000, completed: false },
        ],
      },
      tasks: {
        create: [
          { title: 'تجهيز نموذج العروض والخدمات المقدمة للعملاء', dueDate: new Date(now.getFullYear(), now.getMonth(), 25), completed: true },
          { title: 'إنشاء موقع الويب الخاص بالشركة وتحديد الهوية', dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), completed: false },
        ],
      },
    },
  })

  const carDream = await prisma.lifeGoal.create({
    data: {
      userId: user.id,
      title: 'شراء سيارة أحلامي الكهربائية',
      description: 'الانتقال إلى قيادة سيارة حديثة ومريحة تخدم تنقلات العائلة وسفرياتي',
      category: 'lifestyle_purchase',
      targetDate: new Date(now.getFullYear() + 2, 5, 30),
      estimatedBudget: 450000,
      priority: 'high',
      status: 'in_progress',
      icon: 'Car',
      color: '#c5a059',
      goalId: carGoal.id,
      milestones: {
        create: [
          { title: 'تجميع 200,000 ج.م كدفعة أولى', targetDate: new Date(now.getFullYear(), 11, 31), cost: 200000, completed: false },
          { title: 'مقارنة العروض وتجربة القيادة', targetDate: new Date(now.getFullYear() + 1, 5, 1), cost: 0, completed: false },
        ],
      },
      tasks: {
        create: [
          { title: 'متابعة الميزانية المخصصة للدفعة الشهرية للسيارة', dueDate: new Date(now.getFullYear(), now.getMonth(), 30), completed: true },
        ],
      },
    },
  })

  const japanDream = await prisma.lifeGoal.create({
    data: {
      userId: user.id,
      title: 'استكشاف اليابان وثقافتها العمرانية',
      description: 'رحلة مدتها 14 يومًا تشمل طوكيو، كيوتو، وأوساكا في موسم أزهار الكرز',
      category: 'travel_experience',
      targetDate: new Date(now.getFullYear() + 1, 8, 30),
      estimatedBudget: 85000,
      priority: 'medium',
      status: 'planning',
      icon: 'Palmtree',
      color: '#4a6b82',
      goalId: travelGoal.id,
      milestones: {
        create: [
          { title: 'حجز التذاكر والفنادق مبكرًا', targetDate: new Date(now.getFullYear() + 1, 2, 1), cost: 45000, completed: false },
          { title: 'استخراج تأشيرة السفر وتجهيز الجدول', targetDate: new Date(now.getFullYear() + 1, 5, 1), cost: 5000, completed: false },
        ],
      },
      tasks: {
        create: [
          { title: 'التحقق من متطلبات التأشيرة السياحية', dueDate: new Date(now.getFullYear(), now.getMonth() + 2, 1), completed: false },
        ],
      },
    },
  })

  console.log('✅ Dreams & Vision Goals created')

  // Monthly Plan & Review
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  await prisma.monthlyPlan.create({
    data: {
      userId: user.id,
      monthYear: currentMonthStr,
      financialTarget: 70000,
      savingsTarget: 25000,
      focusNotes: 'التركيز هذا الشهر على رفع الفائض الادخاري وضبط نفقات المطاعم والتسوق.',
      personalGoals: JSON.stringify([
        'الالتزام بخطة الادخار الشهرية (25,000 ج.م)',
        'إكمال الدورة التدريبية الخاصة بالذكاء الاصطناعي',
        'ممارسة الرياضة 3 أيام أسبوعياً',
      ]),
      habits: JSON.stringify([
        'تسجيل كافة المعاملات فور وقوعها',
        'مراجعة الميزانية أسبوعياً',
        'القراءة 20 دقيقة يومياً',
      ]),
      plannedPurchases: JSON.stringify([
        'شراء شاشة إضافية لمكتب العمل (الميزانية: 6,000 ج.م)',
        'تجديد اشتراكات الأدوات السحابية',
      ]),
    },
  })

  await prisma.monthlyReview.create({
    data: {
      userId: user.id,
      monthYear: `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`,
      achievements: JSON.stringify([
        'تحقيق زيادة 12% في الدخل الجانبي من الأعمال المستقلة',
        'الوصول إلى 70% من هدف صندوق الطوارئ',
        'الالتزام بميزانية السكن والخدمات تماماً',
      ]),
      reflections: 'كان الشهر السابق ممتازاً من ناحية التدفقات النقدية. تم التحكم بالنفقات الكبيرة بشكل أفضل من الأشهر الماضية.',
      rating: 5,
    },
  })

  console.log('✅ Monthly Plan & Review created')
  console.log('🚀 Seeds completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
