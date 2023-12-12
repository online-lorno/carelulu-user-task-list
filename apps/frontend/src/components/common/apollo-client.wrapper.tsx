'use client'

import { ApolloProvider } from '@apollo/client'

import { apolloClient } from '@/lib/apollo-client.client'

// you need to create a component to wrap your app in
export function ApolloClientWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
