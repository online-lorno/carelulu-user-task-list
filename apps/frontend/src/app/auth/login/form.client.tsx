'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { loginSuccessAction } from '../action'
import { loginSchema, TLogin } from './schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { fetchClient } from '@/lib/fetch.client'
import useStore from '@/lib/useStore'
import { useUserStore } from '@/stores/app.store'

const LOGIN = gql`
  mutation Login($input: AuthLoginInput!) {
    login(input: $input) {
      access_token
    }
  }
`

export function LoginForm() {
  const store = useStore(useUserStore, (state) => state)
  const { toast } = useToast()
  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [mutateLogin] = useMutation(LOGIN)

  const handleSubmit = async (values: TLogin) => {
    if (store?.apiMode === 'rest') {
      try {
        const result = await fetchClient('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        })
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Successfully logged in',
        })

        // Set username
        if (result?.username) {
          store.setUsername(result.username)
        }

        // Set access token as cookie value in action
        if (result?.access_token) {
          await loginSuccessAction(result.access_token)
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Username/Password is incorrect',
        })
      }
    } else if (store?.apiMode === 'graphql') {
      try {
        const result = await mutateLogin({
          variables: {
            input: {
              username: values.username,
              password: values.password,
            },
          },
        })
        toast({
          variant: 'success',
          title: 'Success',
          description: `Successfully Logged in`,
        })

        // Set username
        if (result?.data?.login?.username) {
          store.setUsername(result?.data?.login?.username)
        }

        // Set access token as cookie value in action
        if (result?.data?.login?.access_token) {
          await loginSuccessAction(result?.data?.login?.access_token)
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Username/Password is incorrect',
        })
      }
    }
  }

  if (!store?.apiMode) {
    return <Skeleton className="h-[328px] w-[300px]" />
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-6 rounded-lg bg-primary p-5"
      >
        <p className="text-2xl font-semibold text-primary-foreground">
          Login to your account
        </p>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">
                  Username
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-4"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="outline" className="w-full">
            Login
          </Button>
          <div>
            <Link href="/auth/register" className="mt-2 text-white">
              Register
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
