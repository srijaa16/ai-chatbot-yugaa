import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  
  const category = (session.user as { id: string; name?: string | null; email?: string | null; category?: string }).category

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar category={category} />
      <div className="flex-1 flex flex-col">
        <Header userName={session.user.name} category={category} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
