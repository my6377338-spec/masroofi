import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT - تحديث معاملة
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { accountId, categoryId, amount, type, description, notes, date } = body

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // إعادة رصيد الحساب القديم
    const oldAccount = await prisma.account.findUnique({
      where: { id: transaction.accountId },
    })

    if (oldAccount) {
      const revertBalance =
        transaction.type === "income"
          ? parseFloat(oldAccount.balance.toString()) - parseFloat(transaction.amount.toString())
          : parseFloat(oldAccount.balance.toString()) + parseFloat(transaction.amount.toString())

      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: revertBalance },
      })
    }

    // تحديث المعاملة
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        accountId: accountId || transaction.accountId,
        categoryId: categoryId || transaction.categoryId,
        amount: amount ? parseFloat(amount) : transaction.amount,
        type: type || transaction.type,
        description: description !== undefined ? description : transaction.description,
        notes: notes !== undefined ? notes : transaction.notes,
        date: date ? new Date(date) : transaction.date,
      },
      include: {
        account: true,
        category: true,
      },
    })

    // تحديث رصيد الحساب الجديد
    const newAccount = await prisma.account.findUnique({
      where: { id: updatedTransaction.accountId },
    })

    if (newAccount) {
      const newBalance =
        updatedTransaction.type === "income"
          ? parseFloat(newAccount.balance.toString()) + parseFloat(updatedTransaction.amount.toString())
          : parseFloat(newAccount.balance.toString()) - parseFloat(updatedTransaction.amount.toString())

      await prisma.account.update({
        where: { id: updatedTransaction.accountId },
        data: { balance: newBalance },
      })
    }

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    )
  }
}

// DELETE - حذف معاملة
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // إعادة رصيد الحساب
    const account = await prisma.account.findUnique({
      where: { id: transaction.accountId },
    })

    if (account) {
      const newBalance =
        transaction.type === "income"
          ? parseFloat(account.balance.toString()) - parseFloat(transaction.amount.toString())
          : parseFloat(account.balance.toString()) + parseFloat(transaction.amount.toString())

      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: newBalance },
      })
    }

    await prisma.transaction.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    )
  }
}
