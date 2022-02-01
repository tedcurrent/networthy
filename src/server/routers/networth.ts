import { BalanceCategory } from '@prisma/client'
import R from 'ramda'
import * as yup from 'yup'

import {
  DEFAULT_CURRENCY,
  makeMoney as makeMoney
} from '../../utils/formatMoney'
import { createRouter } from '../createRouter'

export const networthRouter = createRouter().query('get-by-timestamp', {
  input: yup.object({
    timestamp: yup.string().required()
  }),
  resolve: async ({ input, ctx }) => {
    const latestBalanceTypesWithItems = await ctx.prisma.balanceType.findMany({
      distinct: ['name'],
      select: {
        cuid: true,
        category: true,
        name: true,
        balanceItems: {
          select: {
            cuid: true,
            value: true,
            balanceType: {
              select: {
                category: true
              }
            }
          },
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
      typesWithItems: typeof latestBalanceTypesWithItems
    ) => {
      return R.pipe(
        R.map((x: { balanceItems: { value: number }[] }) => {
          return R.head(x.balanceItems)?.value ?? null
        }),
        R.reject(R.isNil),
        R.sum
      )(typesWithItems)
    }

    const assetsValue = computeBalanceValue(assets)
    const liabilitiesValue = computeBalanceValue(liabilities)

    return {
      networth: {
        money: makeMoney(assetsValue - liabilitiesValue, DEFAULT_CURRENCY)
      },
      assetsTotal: {
        money: makeMoney(assetsValue, DEFAULT_CURRENCY)
      },
      liabilitiesTotal: {
        money: makeMoney(liabilitiesValue, DEFAULT_CURRENCY)
      },
      breakdown: {
        assets,
        liabilities
      }
    }
  }
})
