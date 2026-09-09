import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - جلب جميع المعاملات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // income, expense, transfer
    const accountId = searchParams.get("accountId")
    const categoryId = searchParams.get("categoryId")

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const where: any = {
      userId: user.id,
    }

    if (type) where.type = type
    if (accountId) where.accountId = accountId
    if (categoryId) where.categoryId = categoryId

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

// POST - إنشاء معاملة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { accountId, categoryId, amount, type, description, notes, date, tags } = body

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // التحقق من الحقول المطلوبة
    if (!accountId || !amount || !type || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // إنشاء المعاملة
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId,
        categoryId: categoryId || null,
        amount: parseFloat(amount),
        type,
        description: description || null,
        notes: notes || null,
        date: new Date(date),
        tags: tags || null,
      },
      include: {
        account: true,
        category: true,
      },
    })

    // تحديث رصيد الحساب
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    })

    if (account) {
      const newBalance =
        type === "income"
          ? parseFloat(account.balance.toString()) + parseFloat(amount)
          : parseFloat(account.balance.toString()) - parseFloat(amount)

      await prisma.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}
