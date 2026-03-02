import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { doctor: true },
  })
  
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safeUser } = user
  return NextResponse.json(safeUser)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { doctorId } = body
  
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { doctorId },
    include: { doctor: true },
  })
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw2, ...safeUser } = user
  return NextResponse.json(safeUser)
}
