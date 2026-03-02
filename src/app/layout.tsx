import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yugaa - Mental Wellness & Maternal Support',
  description: 'AI-powered mental wellness and maternal health support platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
