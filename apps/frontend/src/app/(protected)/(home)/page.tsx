import { gql } from '@apollo/client'

import { TaskList } from './tasklist.client'
import { getClient } from '@/lib/apollo-client.server'
import { fetchServer } from '@/lib/fetch.server'

export const dynamic = 'force-dynamic'

const tasksQuery = gql`
  query Tasks {
    tasks {
      id
      note
      date
    }
  }
`

async function getTasks() {
  return await fetchServer('/task', { next: { tags: ['tasks'] } })
}

export default async function HomePage() {
  // const tasks = await getTasks()
  const { data } = await getClient().query({ query: tasksQuery })

  return (
    <>
      <TaskList tasks={data?.tasks} />
    </>
  )
}
