import { redirect } from 'next/navigation'

import { isVerifiedSession } from '@/lib/session'

export default async function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const verifiedSession = await isVerifiedSession()
  if (verifiedSession) {
    redirect('/')
  }

  return (
    <main className="flex min-h-[calc(100vh-250px)] justify-center pt-14">
      <div className="w-[300px]">{children}</div>
    </main>
  )
}
