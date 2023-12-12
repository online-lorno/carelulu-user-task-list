import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { APP_STORAGE_NAME } from '../lib/constants'

export type TApp = {
  apiMode: 'rest' | 'graphql'
  setApiMode: (mode: 'rest' | 'graphql') => void
  username?: string
  setUsername: (username: string | undefined) => void
  // _hasHydrated: boolean
  // setHasHydrated: (state: boolean) => void
}

export const useUserStore = create<TApp>()(
  persist(
    (set, get) => ({
      apiMode: 'rest',
      setApiMode: (mode: 'rest' | 'graphql') => set({ apiMode: mode }),
      username: undefined,
      setUsername: (username: string | undefined) => set({ username }),
      // _hasHydrated: false,
      // setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: APP_STORAGE_NAME,
      // onRehydrateStorage: (state) => {
      //   state.setHasHydrated(true)
      // },
    },
  ),
)
