import { redirect } from 'next/navigation'

import { isVerifiedSession } from '@/lib/session'

export default async function ProtectedRoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const verifiedSession = await isVerifiedSession()
  if (!verifiedSession) {
    redirect('/auth/login')
  }

  return <main className="h-[calc(100vh-100px)] w-full pt-10">{children}</main>
}
