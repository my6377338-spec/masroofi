import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - جلب جميع التصنيفات
export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST - إنشاء تصنيف جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, icon, color } = body

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        userId: user.id,
        name,
        type,
        icon: icon || null,
        color: color || null,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
