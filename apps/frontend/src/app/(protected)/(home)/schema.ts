import * as z from 'zod'

export type TTask = {
  id: string
  userId: string
  note: string
  date: string
}

export const createTaskSchema = z.object({
  note: z.string().min(1, { message: 'Note is required.' }),
  date: z.date({ required_error: 'Date is required.' }),
})

export type TCreateTask = z.infer<typeof createTaskSchema>
