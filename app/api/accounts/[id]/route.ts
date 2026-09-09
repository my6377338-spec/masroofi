import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT - تحديث حساب
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, type, balance, currency, icon, color } = body

    const account = await prisma.account.findUnique({
      where: { id },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        name: name || account.name,
        type: type || account.type,
        balance: balance !== undefined ? parseFloat(balance) : account.balance,
        currency: currency || account.currency,
        icon: icon !== undefined ? icon : account.icon,
        color: color !== undefined ? color : account.color,
      },
    })

    return NextResponse.json(updatedAccount)
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    )
  }
}

// DELETE - حذف حساب
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        transactions: true,
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // التحقق من وجود معاملات مرتبطة
    if (account.transactions.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete account with existing transactions" },
        { status: 400 }
      )
    }

    await prisma.account.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}
