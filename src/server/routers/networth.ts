import { BalanceCategory } from '@prisma/client'
import R from 'ramda'
import * as yup from 'yup'

import { Money } from '../../@types/Money'
import { DEFAULT_CURRENCY, makeMoney } from '../../utils/money'
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

    const breakdown = {
      assets: formatBalance(assets),
      liabilities: formatBalance(liabilities)
    }

    const assetsValue = computeTypeTotal(breakdown.assets)
    const liabilitiesValue = computeTypeTotal(breakdown.liabilities)

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
      breakdown
    }
  }
})

const computeTypeTotal = R.pipe(
  R.map((x: { money: Money }) => x.money.value),
  R.sum
)

const formatBalance = R.map(
  (x: {
    balanceItems: { value: number }[]
    category: BalanceCategory
    cuid: string
    name: string
  }) => ({
    cuid: x.cuid,
    name: x.name,
    category: x.category,
    money: makeMoney(R.head(x.balanceItems)?.value ?? 0, DEFAULT_CURRENCY)
  })
)
