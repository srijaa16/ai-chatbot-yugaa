import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const doctorId = searchParams.get('doctorId')
  
  if (!doctorId) return NextResponse.json({ error: 'doctorId required' }, { status: 400 })
  
  const messages = await prisma.doctorMessage.findMany({
    where: { userId: session.user.id, doctorId },
    orderBy: { createdAt: 'asc' },
  })
  
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { doctorId, content } = body
  
  const message = await prisma.doctorMessage.create({
    data: {
      userId: session.user.id,
      doctorId,
      content,
      sender: 'user',
    },
  })
  
  const doctorReplies = [
    "Thank you for reaching out. I've reviewed your message and will get back to you shortly.",
    "I understand your concern. Based on what you've described, I recommend we schedule a consultation.",
    "That's a great question. Let me provide some guidance based on your health profile.",
    "I appreciate you sharing this with me. Your wellbeing is our top priority.",
    "Please don't hesitate to contact me if your symptoms worsen. I'm here to help.",
  ]
  const autoReply = doctorReplies[Math.floor(Math.random() * doctorReplies.length)]
  
  await prisma.doctorMessage.create({
    data: {
      userId: session.user.id,
      doctorId,
      content: autoReply,
      sender: 'doctor',
    },
  })
  
  return NextResponse.json({ success: true, message, autoReply })
}
