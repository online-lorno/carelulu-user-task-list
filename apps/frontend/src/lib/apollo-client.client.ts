'use client'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { parseCookies } from 'nookies'

import { SESSION_COOKIE_NAME } from '@/lib/constants'

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL })

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = parseCookies()[SESSION_COOKIE_NAME]
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})
