import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const reminders = await prisma.reminder.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  
  return NextResponse.json(reminders)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { title, description, time, days, type } = body
  
  const reminder = await prisma.reminder.create({
    data: {
      userId: session.user.id,
      title,
      description,
      time,
      days: JSON.stringify(days),
      type,
      active: true,
    },
  })
  
  return NextResponse.json(reminder)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  await prisma.reminder.delete({ where: { id: id! } })
  
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { id, active } = body
  
  const reminder = await prisma.reminder.update({
    where: { id },
    data: { active },
  })
  
  return NextResponse.json(reminder)
}
