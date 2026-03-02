# Yugaa — AI Mental Wellness & Maternal Support Platform

Yugaa is an intelligent, privacy-first AI wellness companion that combines mental health assessments, AI-powered chat support, maternal care, and seamless doctor communication into one platform.

## Features

- **Personalized Dashboard** — adapts to your profile (General Wellness, Maternal, New Parent)
- **PHQ-9 & GAD-7 Assessments** — standardized depression and anxiety screening tools
- **AI Chatbot** — empathetic, context-aware mental wellness support
- **Doctor Chat** — direct messaging with your assigned care provider
- **Appointment Scheduling** — book video, phone, or in-person sessions
- **Maternal Care Module** — pregnancy tracker, trimester tips, prenatal checklist
- **Child Care Module** — milestone tracker, feeding log, vaccination schedule
- **Reminders** — medication, prenatal vitamins, appointments, and more
- **Secure Doctor Assignment** — privacy-first, continuous care model

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and fill in a strong NEXTAUTH_SECRET / AUTH_SECRET
# (generate one with: openssl rand -base64 32)

# 3. Run database migrations and seed sample doctors
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Register an account

Visit `/auth/register` to create an account. Choose your profile type:
- **General Wellness Seeker** — mental health tracking and AI support
- **Pregnant / Expectant Mother** — prenatal care, pregnancy tracker
- **New Parent** — postpartum wellness, baby milestone tracking

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://prisma.io) with SQLite
- [NextAuth.js v5](https://authjs.dev)

## Deploy on Vercel

Set the environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXTAUTH_URL`) in your Vercel project settings before deploying.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
