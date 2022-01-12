import * as trpc from '@trpc/server'
import R from 'ramda'
import { z } from 'zod'

import { prisma } from '../utils/prisma'

export const appRouter = trpc.router().query('get-networth-by-timestamp', {
  input: z.object({
    timestamp: z.string()
  }),
  resolve: async ({ input }) => {
    const categories = await prisma.wealthCategory.findMany({
      distinct: ['type'],
      include: {
        wealthSources: {
          take: 2,
          where: {
            createdAt: {
              lte: input.timestamp
            }
          },
          orderBy: {
            id: 'desc'
          }
        }
      }
    })

    const latest = categories.map(x => R.head(x.wealthSources)).filter(x => !!x)

    const previous = categories
      .map(x => (x.wealthSources.length > 1 ? R.last(x.wealthSources) : null))
      .filter(x => !!x)

    return {
      networth: {
        money: {
          value: latest.reduce((acc, curr) => acc + (curr?.value ?? 0), 0),
          currency: 'EUR'
        },
        timestamp: R.head(latest)?.createdAt
      },
      previousNetworth: {
        money: {
          value: previous.reduce((acc, curr) => acc + (curr?.value ?? 0), 0),
          currency: 'EUR'
        },
        timestamp: R.head(previous)?.createdAt
      }
    }
  }
})

export type AppRouter = typeof appRouter
