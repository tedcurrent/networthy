import { BalanceCategory, BalanceItem, BalanceType } from '@prisma/client'
import * as trpc from '@trpc/server'
import R from 'ramda'
import { z } from 'zod'

import { prisma } from '../utils/prisma'

export const appRouter = trpc.router().query('get-networth-by-timestamp', {
  input: z.object({
    timestamp: z.string()
  }),
  resolve: async ({ input }) => {
    const latestBalanceTypesWithItems = await prisma.balanceType.findMany({
      distinct: ['name'],
      include: {
        balanceItems: {
          take: 1,
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

    const [assets, liabilities] = R.partition(
      balanceType => balanceType.category === BalanceCategory.ASSET,
      latestBalanceTypesWithItems
    )

    const computeBalanceValue = (
      typesWithItems: (BalanceType & { balanceItems: BalanceItem[] })[]
    ) => {
      return R.pipe(
        R.map((balanceType: BalanceType & { balanceItems: BalanceItem[] }) => {
          const item = R.head(balanceType.balanceItems)

          return item ? item.value : null
        }),
        R.reject(R.isNil),
        R.sum
      )(typesWithItems)
    }

    const assetsValue = computeBalanceValue(assets)
    const liabilitiesValue = computeBalanceValue(liabilities)

    return {
      networth: {
        money: {
          value: assetsValue - liabilitiesValue,
          currency: 'EUR'
        }
      },
      assets: {
        money: {
          value: assetsValue,
          currency: 'EUR'
        }
      },
      liabilitiesTotal: {
        money: {
          value: liabilitiesValue,
          currency: 'EUR'
        }
      }
    }
  }
})

export type AppRouter = typeof appRouter
