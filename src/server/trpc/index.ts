import * as trpc from '@trpc/server'
import { formatISO, sub } from 'date-fns'
import { z } from 'zod'

export const appRouter = trpc.router().query('get-networth-by-timestamp', {
  input: z.object({
    timestamp: z.string()
  }),
  resolve: ({ input }) => {
    return {
      networth: {
        money: {
          value: 12346.6667,
          currency: 'EUR'
        },
        timestamp: input.timestamp
      },
      previousNetworth: {
        money: {
          value: 12000.6667,
          currency: 'EUR'
        },
        timestamp: formatISO(sub(new Date(input.timestamp), { days: 7 }))
      }
    }
  }
})

export type AppRouter = typeof appRouter
