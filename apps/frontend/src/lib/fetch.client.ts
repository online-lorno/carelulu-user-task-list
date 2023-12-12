'use client'

import { parseCookies } from 'nookies'

import { SESSION_COOKIE_NAME } from '@/lib/constants'

export async function fetchClient(path: string, options: RequestInit = {}) {
  const token = parseCookies()[SESSION_COOKIE_NAME]
  const defaultHeaders = {
    'Content-Type': 'application/json',
    authorization: token ? `Bearer ${token}` : '',
  }
  const url = `${process.env.NEXT_PUBLIC_REST_API_URL}${path}`

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
