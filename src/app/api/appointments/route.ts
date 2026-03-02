import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: { doctor: true },
    orderBy: { date: 'asc' },
  })
  
  return NextResponse.json(appointments)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { doctorId, date, time, type, notes } = body
  
  const appointment = await prisma.appointment.create({
    data: {
      userId: session.user.id,
      doctorId,
      date: new Date(date),
      time,
      type,
      notes,
      status: 'scheduled',
    },
    include: { doctor: true },
  })
  
  return NextResponse.json(appointment)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { id, status } = body
  
  const existing = await prisma.appointment.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: { doctor: true },
  })
  
  return NextResponse.json(appointment)
}
