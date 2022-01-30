import { BalanceCategory, BalanceItem, BalanceType } from '@prisma/client'
import R from 'ramda'
import * as yup from 'yup'

import { DEFAULT_CURRENCY, formatMoney } from '../../utils/formatMoney'
import { createRouter } from '../createRouter'

export const networthRouter = createRouter().query('get-by-timestamp', {
  input: yup.object({
    timestamp: yup.string().required()
  }),
  resolve: async ({ input, ctx }) => {
    const latestBalanceTypesWithItems = await ctx.prisma.balanceType.findMany({
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
        money: formatMoney(assetsValue - liabilitiesValue, DEFAULT_CURRENCY)
      },
      assets: {
        money: formatMoney(assetsValue, DEFAULT_CURRENCY)
      },
      liabilitiesTotal: {
        money: formatMoney(liabilitiesValue, DEFAULT_CURRENCY)
      }
    }
  }
})
