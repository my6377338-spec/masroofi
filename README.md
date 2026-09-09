# Masroofi | مصروفي

تطبيق ويب كامل لإدارة المصروفات الشخصية مبني بـ Next.js 16 + TypeScript + Prisma + SQLite

## 🚀 التشغيل السريع

```bash
# 1. تثبيت التبعيات
npm install

# 2. إعداد قاعدة البيانات
npx prisma db push
npx prisma generate

# 3. تشغيل المشروع
npm run dev
```

ثم افتح المتصفح على: **http://localhost:3000**

## 📋 المتطلبات

- Node.js 18+ 
- npm

## 🏗️ التقنيات المستخدمة

### Frontend
- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Next.js Route Handlers** - API
- **Server Actions** - Server-side logic
- **NextAuth.js** - Authentication
- **bcryptjs** - Password Hashing

### Database
- **SQLite** - Database (سهل الإعداد، يمكن تبديله بـ PostgreSQL)
- **Prisma ORM** - Database Toolkit

### Forms & Validation
- **React Hook Form** - Form Management
- **Zod** - Schema Validation

## 📁 هيكل المشروع

```
masroofi/
├── app/
│   ├── api/
│   │   └── auth/           # Authentication APIs
│   ├── auth/
│   │   ├── signin/         # صفحة تسجيل الدخول
│   │   └── signup/         # صفحة التسجيل
│   ├── dashboard/          # الصفحة الرئيسية
│   ├── globals.css         # Global Styles
│   ├── layout.tsx          # Root Layout
│   └── page.tsx            # Home (redirect)
├── components/
│   ├── ui/                 # UI Components
│   ├── layout/             # Layout Components
│   └── providers.tsx       # Context Providers
├── lib/
│   ├── prisma.ts           # Prisma Client
│   └── utils.ts            # Utility Functions
├── prisma/
│   ├── schema.prisma       # Database Schema
│   └── dev.db              # SQLite Database (auto-generated)
├── .env                    # Environment Variables
├── .env.example            # Environment Variables Template
├── next.config.js          # Next.js Configuration
├── tailwind.config.js      # Tailwind Configuration
├── tsconfig.json           # TypeScript Configuration
└── package.json            # Dependencies
```

## 🎨 الميزات

### ✅ تم تنفيذه
- ✅ Authentication (Register/Login/Logout)
- ✅ Protected Routes
- ✅ Dashboard مع إحصائيات
- ✅ Database Schema (Users, Accounts, Transactions, Categories, Budgets, Goals)
- ✅ RTL Support (Arabic)
- ✅ Responsive Design
- ✅ Dark/Light Mode Ready

### 🚧 قيد التطوير
- 🚧 صفحة المعاملات (Transactions)
- 🚧 صفحة الحسابات (Accounts)
- 🚧 صفحة الميزانيات (Budgets)
- 🚧 صفحة الأهداف (Goals)
- 🚧 صفحة التحليلات (Analytics)
- 🚧 صفحة الإعدادات (Settings)
- 🚧 إضافة/تعديل/حذف المعاملات
- 🚧 Charts مع Recharts

## 🔐 Authentication

التطبيق يستخدم **NextAuth.js** مع **Credentials Provider**:
- Email + Password
- Password Hashing مع bcryptjs
- Protected Routes
- Session Management

## 💾 Database Schema

### Models
- **User** - المستخدمين
- **Account** - الحسابات المالية (نقدي، بنك، محفظة، ...)
- **Transaction** - المعاملات (دخل، مصروف، تحويل)
- **Category** - التصنيفات
- **Budget** - الميزانيات
- **Goal** - الأهداف المالية
- **UserSettings** - إعدادات المستخدم

## 🛠️ أوامر مفيدة

```bash
# Development
npm run dev              # تشغيل المشروع في وضع التطوير
npm run build            # بناء المشروع للإنتاج
npm run start            # تشغيل المشروع المبني
npm run lint             # فحص الكود
npm run typecheck        # فحص TypeScript

# Database
npx prisma db push       # تطبيق Schema على قاعدة البيانات
npx prisma generate      # توليد Prisma Client
npx prisma studio        # فتح Prisma Studio (GUI)
npm run db:seed          # إضافة بيانات تجريبية (إذا كان موجود)
```

## 🔧 إعداد البيئة

انسخ `.env.example` إلى `.env` وعدّل القيم:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
```

لتوليد `NEXTAUTH_SECRET` آمن:
```bash
openssl rand -base64 32
```

## 🌐 استخدام PostgreSQL بدلاً من SQLite

إذا أردت استخدام PostgreSQL:

1. عدّل `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. عدّل `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/masroofi"
```

3. أعد تطبيق Schema:
```bash
npx prisma db push
npx prisma generate
```

## 📱 Responsive Design

التطبيق responsive على جميع الأحجام:
- **Desktop**: Sidebar قابل للطي
- **Mobile**: Bottom Navigation
- **Tablet**: متوسط بينهما

## 🎨 Design System

### Colors
- **Primary**: Terracotta/Coral (#e86845)
- **Background**: Warm Cream (#faf9f7)
- **Income**: Green (#22c55e)
- **Expense**: Red (#ef4444)
- **Savings**: Purple (#a855f7)

### Typography
- **Font**: Cairo (Google Fonts)
- **RTL Support**: Yes

## 🐛 استكشاف الأخطاء

### المشروع لا يعمل؟
```bash
# امسح node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install

# أعد توليد Prisma Client
npx prisma generate

# أعد تشغيل المشروع
npm run dev
```

### مشكلة في قاعدة البيانات؟
```bash
# احذف قاعدة البيانات وأعد إنشائها
rm prisma/dev.db
npx prisma db push
```

## 📝 ملاحظات

- **SQLite** مستخدم افتراضيًا لسهولة الإعداد
- قاعدة البيانات موجودة في `prisma/dev.db`
- كل البيانات محفوظة محليًا على جهازك
- التطبيق يعمل بالكامل offline

## 🚀 الخطوات التالية

1. ✅ تسجيل حساب جديد
2. ✅ تسجيل الدخول
3. ✅ مشاهدة Dashboard
4. 🚧 إضافة حساب مالي
5. 🚧 إضافة معاملة
6. 🚧 إنشاء ميزانية
7. 🚧 إنشاء هدف مالي
8. 🚧 مشاهدة التحليلات

## 📄 License

MIT

## 🤝 المساهمة

المشروع مفتوح للتطوير والتحسين!

---

Made with ❤️ using Next.js + TypeScript + Prisma
