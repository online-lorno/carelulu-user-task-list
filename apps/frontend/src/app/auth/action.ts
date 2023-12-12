'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SESSION_COOKIE_NAME } from '@/lib/constants'

const expiresIn = 60 * 60 * 24 * 7 // 7 days

export async function loginSuccessAction(token: string) {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: token,
    maxAge: expiresIn,
  })
  redirect('/')
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE_NAME)
  redirect('/auth/login')
}
