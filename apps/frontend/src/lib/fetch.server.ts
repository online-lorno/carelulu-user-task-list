import { cookies } from 'next/headers'

import { SESSION_COOKIE_NAME } from '@/lib/constants'

export async function fetchServer(path: string, options: RequestInit = {}) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionCookie?.value ?? ''}`,
  }

  const url = `${process.env.REST_API_URL}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Fetch request failed: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}
