'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import { logoutAction } from '@/app/auth/action'
import useStore from '@/lib/useStore'
import { useUserStore } from '@/stores/app.store'

export const Header = () => {
  const store = useStore(useUserStore, (state) => state)
  const router = useRouter()
  const handleSwitchMode = () => {
    if (store) {
      store.setApiMode(store.apiMode === 'graphql' ? 'rest' : 'graphql')
    }
  }

  if (!store) {
    return <Skeleton className="h-10 w-full" />
  }

  return (
    <header className="w-full bg-primary">
      <div className="container mx-auto flex justify-between py-2">
        <div className="flex items-center space-x-5">
          <Image src="/logo.png" alt="Logo" width={122} height={40} />
          <div className="flex">
            <Input placeholder="Enter your zipcode" className="h-[30px]" />
            <Button
              variant="secondary"
              className="-ml-1 h-[30px] rounded-none px-3"
            >
              Search
            </Button>
          </div>
        </div>
        <div className="flex space-x-5">
          {!store?.apiMode ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <Button variant="secondary" onClick={handleSwitchMode}>
              Switch to {store.apiMode === 'graphql' ? 'REST' : 'GraphQL'}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="accent">
                Menu <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* <DropdownMenuLabel>Hi {store.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async (_) => {
                      store.setUsername(undefined)
                      await logoutAction()
                    }}
                  >
                    <span>Log out</span>
                  </DropdownMenuItem> */}
              {store?.username ? (
                <>
                  <DropdownMenuLabel>Hi {store.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async (_) => {
                      store.setUsername(undefined)
                      await logoutAction()
                    }}
                  >
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onSelect={() => router.push('/auth/login')}>
                    <span>Log in</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => router.push('/auth/register')}
                  >
                    <span>Register</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
