import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, category, pregnancyWeek, dueDate, childBirthDate } = body
    
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        category: category || 'general_wellness',
        pregnancyWeek: pregnancyWeek ? parseInt(pregnancyWeek) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        childBirthDate: childBirthDate ? new Date(childBirthDate) : null,
      },
    })
    
    return NextResponse.json({ success: true, userId: user.id })
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
