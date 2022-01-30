import { createRouter } from '../createRouter'
import { balanceItemRouter } from './balanceItem'
import { balanceTypeRouter } from './balanceType'
import { networthRouter } from './networth'
import { trendRouter } from './trend'

export const appRouter = createRouter()
  .merge('networth.', networthRouter)
  .merge('trend.', trendRouter)
  .merge('balanceType.', balanceTypeRouter)
  .merge('balanceItem.', balanceItemRouter)

export type AppRouter = typeof appRouter
