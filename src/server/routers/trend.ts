import { Prisma } from '@prisma/client'

import { DEFAULT_CURRENCY } from '../../utils/money'
import { createRouter } from '../createRouter'

type NetworthTrendDataPoint = { dateTime: string; networth: number }

export const trendRouter = createRouter().query('get', {
  resolve: async ({ ctx }) => {
    // Calculates networth per date on db level. It's slightly tricky as not
    // all datetimes have all categories filled in, so some cross joining has to be done.
    // This is where Prisma can't help us.
    const trend: NetworthTrendDataPoint[] = await ctx.prisma
      .$queryRaw(Prisma.sql`
        select
          createdAtDate as dateTime,
          sum(CASE when category = 'ASSET' then value else (value * -1) end) as networth
        from
        (
          select
            createdAtDate,
            balanceTypeId,
            category,
            (
              select
                value
              from
                BalanceItem
              where
                BalanceItem.balanceTypeId = w.balanceTypeId
                and date(createdAt) <= w.createdAtDate
              order by
                createdAt desc
              limit
                1
            ) as value
          from
            (
              select
                *
              from
                (select id as balanceTypeId, category from BalanceType) as typeIds
                cross join 
                (select distinct date(createdAt) as createdAtDate from BalanceItem) as createdAts
            ) as w
        ) as tot
        group by
          createdAtDate;
    `)

    return {
      trend,
      currency: DEFAULT_CURRENCY
    }
  }
})
