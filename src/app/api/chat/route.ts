import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function generateAIResponse(message: string): string {
  const msg = message.toLowerCase()
  
  if (msg.includes('sad') || msg.includes('depress') || msg.includes('hopeless')) {
    return "I'm really sorry you're feeling this way. Depression and sadness are very real, and it's brave of you to reach out. Remember, you're not alone in this. Would you like to talk more about what's been bringing you down? Sometimes sharing can help lighten the load. Also, consider taking our PHQ-9 assessment to better understand your current state."
  }
  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worry') || msg.includes('panic')) {
    return "Anxiety can feel overwhelming, but you're taking a positive step by talking about it. Try this: take a slow, deep breath in for 4 counts, hold for 4, and exhale for 4. This 'box breathing' can help calm your nervous system. Would you like some more anxiety management techniques? Our GAD-7 assessment can also help track your anxiety levels."
  }
  if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('tired')) {
    return "Sleep difficulties can really impact your mental health. Some tips: try to maintain a consistent sleep schedule, avoid screens an hour before bed, and create a calming bedtime routine. If sleep issues persist, it might be worth discussing with a healthcare provider. Would you like to set a sleep reminder?"
  }
  if (msg.includes('pregnant') || msg.includes('pregnancy') || msg.includes('baby') || msg.includes('maternal')) {
    return "Pregnancy and new parenthood are beautiful but also challenging journeys. Your mental health matters just as much as your physical health during this time. Perinatal mood disorders are common and very treatable. Have you been using our pregnancy tracker? It can help you stay on top of your health milestones."
  }
  if (msg.includes('postpartum') || msg.includes('new mom') || msg.includes('new parent')) {
    return "The postpartum period can be emotionally complex. What you're feeling is valid. Postpartum depression affects many new parents and is highly treatable. Please know that asking for help is a sign of strength, not weakness. I'd encourage you to take our PHQ-9 assessment and consider scheduling an appointment with one of our supportive doctors."
  }
  if (msg.includes('stress') || msg.includes('overwhelm')) {
    return "Feeling stressed and overwhelmed is very common, especially with everything life demands of us. Let's work through this together. Some immediate strategies: identify your top stressors, practice mindfulness, and break big tasks into smaller steps. Would you like to explore more stress management techniques?"
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! I'm your Yugaa wellness companion. I'm here to support your mental health journey. How are you feeling today? You can talk to me about anything - stress, anxiety, sleep, pregnancy wellness, or just how your day is going."
  }
  if (msg.includes('help') || msg.includes('support')) {
    return "I'm here to help! I can support you with mental wellness guidance, coping strategies for anxiety and depression, pregnancy and postpartum support, and help you navigate our platform features like assessments, appointments, and reminders. What would you like help with today?"
  }
  if (msg.includes('thank')) {
    return "You're very welcome! Remember, taking care of your mental health is one of the most important things you can do. I'm always here when you need to talk. Is there anything else on your mind?"
  }
  
  return "Thank you for sharing that with me. Your mental wellness journey is important, and I'm here to support you every step of the way. Could you tell me more about how you're feeling? The more I understand, the better I can help. Remember, you can also use our assessment tools, speak with a doctor, or set up reminders for self-care routines."
}

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const messages = await prisma.message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    take: 50,
  })
  
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { content } = body
  
  await prisma.message.create({
    data: { userId: session.user.id, content, role: 'user' },
  })
  
  const aiResponse = generateAIResponse(content)
  
  const assistantMessage = await prisma.message.create({
    data: { userId: session.user.id, content: aiResponse, role: 'assistant' },
  })
  
  return NextResponse.json({ response: aiResponse, message: assistantMessage })
}
