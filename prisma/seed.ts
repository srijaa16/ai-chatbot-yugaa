import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const doctors = [
    { name: 'Dr. Sarah Chen', specialty: 'Psychiatry & Mental Health', email: 'sarah.chen@yugaa.health', available: true },
    { name: 'Dr. Michael Rodriguez', specialty: 'Maternal-Fetal Medicine', email: 'michael.rodriguez@yugaa.health', available: true },
    { name: 'Dr. Priya Sharma', specialty: 'Obstetrics & Gynecology', email: 'priya.sharma@yugaa.health', available: true },
    { name: 'Dr. James Wilson', specialty: 'Perinatal Mental Health', email: 'james.wilson@yugaa.health', available: true },
    { name: 'Dr. Aisha Patel', specialty: 'Pediatrics & Child Development', email: 'aisha.patel@yugaa.health', available: true },
  ]

  for (const doctor of doctors) {
    await prisma.doctor.upsert({ where: { email: doctor.email }, update: {}, create: doctor })
  }
  console.log('Seeded doctors successfully')
}

main().catch(console.error).finally(() => prisma.$disconnect())
