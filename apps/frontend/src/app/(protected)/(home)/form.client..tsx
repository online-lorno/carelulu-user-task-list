'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format, startOfDay } from 'date-fns'

import refreshTasksAction from './action'
import { createTaskSchema, TCreateTask, TTask } from './schema'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { fetchClient } from '@/lib/fetch.client'
import useStore from '@/lib/useStore'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/app.store'

const TASK_CREATE = gql`
  mutation TaskCreate($input: TaskCreateInput!) {
    taskCreate(input: $input) {
      id
      note
    }
  }
`

const TASK_UPDATE = gql`
  mutation TaskUpdate($id: ID!, $input: TaskUpdateInput) {
    taskUpdate(id: $id, input: $input) {
      id
      note
    }
  }
`

export function AddEditForm({
  selectedTask,
  setSelectedTask,
}: {
  selectedTask?: TTask
  setSelectedTask: (task?: TTask) => void
}) {
  const store = useStore(useUserStore, (state) => state)
  const { toast } = useToast()
  const form = useForm<TCreateTask>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      note: '',
      date: undefined,
    },
  })
  const [mutateCreateTask] = useMutation(TASK_CREATE)
  const [mutateUpdateTask] = useMutation(TASK_UPDATE)

  useEffect(() => {
    if (selectedTask) {
      form.setValue('note', selectedTask?.note ?? '')
      form.setValue(
        'date',
        selectedTask?.date ? new Date(selectedTask.date) : new Date(),
      )
    } else {
      form.setValue('note', '')
    }
  }, [form, selectedTask])

  const handleSubmit = async (values: TCreateTask) => {
    if (store?.apiMode === 'rest') {
      try {
        await fetchClient(`/task${selectedTask ? `/${selectedTask.id}` : ''}`, {
          method: selectedTask ? 'PATCH' : 'POST',
          body: JSON.stringify({
            note: values.note,
            date: values.date,
          }),
        })
        form.reset()
        setSelectedTask(undefined)
        refreshTasksAction()
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Successfully created task',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error creating task',
        })
      }
    } else if (store?.apiMode === 'graphql') {
      try {
        if (selectedTask) {
          await mutateUpdateTask({
            variables: {
              id: selectedTask.id,
              input: {
                note: values.note,
                date: values.date,
              },
            },
          })
        } else {
          await mutateCreateTask({
            variables: {
              input: {
                note: values.note,
                date: values.date,
              },
            },
          })
        }
        form.reset()
        setSelectedTask(undefined)
        refreshTasksAction()
        toast({
          variant: 'success',
          title: 'Success',
          description: `Successfully ${
            selectedTask ? 'updated' : 'created'
          } task`,
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Error ${selectedTask ? 'updating' : 'creating'} task`,
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
        className="bg-primary-background w-full border-b-2 border-primary py-6"
      >
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Add a note"
                      className={cn(
                        'border-2 border-primary py-6 text-2xl focus-visible:ring-transparent',
                        form.formState.errors.note && 'border-destructive',
                      )}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-[300px] border-2 border-primary py-6 pl-3 text-left text-2xl font-normal',
                            !field.value && 'text-muted-foreground',
                            form.formState.errors.date && 'border-destructive',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < startOfDay(new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            {selectedTask ? 'Edit' : 'Add'} Note
          </Button>
        </div>
      </form>
    </Form>
  )
}
