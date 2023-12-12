import { cache } from 'react'
import { cookies } from 'next/headers'

import { SESSION_COOKIE_NAME } from './constants'
import { fetchServer } from './fetch.server'

export const isVerifiedSession = cache(async () => {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)
  if (!sessionCookie) {
    return false
  }

  const result: boolean = await fetchServer('/auth/verify-token', {
    method: 'POST',
    headers: {
      Cookie: `${SESSION_COOKIE_NAME}=${sessionCookie.value}`,
    },
    body: JSON.stringify({ token: sessionCookie.value }),
  })

  return result
})
