'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { registerSchema, TRegister } from './schema'
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

const REGISTER = gql`
  mutation Login($input: AuthRegisterInput!) {
    register(input: $input)
  }
`

export function RegisterForm() {
  const store = useStore(useUserStore, (state) => state)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mutateRegister] = useMutation(REGISTER)

  const handleSubmit = async (values: TRegister) => {
    if (store?.apiMode === 'rest') {
      try {
        await fetchClient('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        })
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Successfully registered',
        })
        router.push('/auth/login')
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error in registering',
        })
      }
    } else if (store?.apiMode === 'graphql') {
      try {
        await mutateRegister({
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
          description: 'Successfully registered',
        })
        router.push('/auth/login')
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error in registering',
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
          Register
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-4"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOpenIcon />
                      ) : (
                        <EyeClosedIcon />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="outline" className="w-full">
            Register
          </Button>
          <div>
            <Link href="/auth/login" className="mt-2 text-white">
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
