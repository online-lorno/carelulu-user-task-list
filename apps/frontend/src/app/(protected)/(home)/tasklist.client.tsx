'use client'

import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'

import refreshTasksAction from './action'
import { AddEditForm } from './form.client.'
import { TTask } from './schema'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { fetchClient } from '@/lib/fetch.client'
import useStore from '@/lib/useStore'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/app.store'

const TASK_DELETE = gql`
  mutation TaskDelete($id: ID!) {
    taskDelete(id: $id) {
      id
      note
    }
  }
`

export function TaskList({ tasks }: { tasks: TTask[] }) {
  const store = useStore(useUserStore, (state) => state)
  const { toast } = useToast()
  const [selectedTask, setSelectedTask] = useState<TTask>()
  const [mutateDeleteTask] = useMutation(TASK_DELETE)

  const handleDelete = async (id: string) => {
    if (store?.apiMode === 'rest') {
      try {
        await fetchClient(`/task/${id}`, {
          method: 'DELETE',
        })
        refreshTasksAction()
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Successfully deleted task',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error deleting task',
        })
      }
    } else if (store?.apiMode === 'graphql') {
      try {
        await mutateDeleteTask({
          variables: { id },
        })
        refreshTasksAction()
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Successfully deleted task',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error deleting task',
        })
      }
    }
  }

  if (!store?.apiMode) {
    return (
      <div className="container flex h-full flex-col space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  return (
    <div className="container flex h-full flex-col">
      <h1 className="text-2xl">Tasks</h1>
      <AddEditForm
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
      {tasks.length === 0 ? (
        <h1 className="text-md py-5 text-center">No Tasks available</h1>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border-b-2 border-b-primary p-5 last:border-b-transparent"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p
                    className={cn(
                      'text-xl',
                      selectedTask?.id === task.id && 'text-secondary',
                    )}
                  >
                    {task.note}
                  </p>
                  <p
                    className={cn(
                      'text-sm',
                      selectedTask?.id === task.id && 'text-secondary',
                    )}
                  >
                    {format(new Date(task.date), 'PPP')}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    <Pencil2Icon />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
