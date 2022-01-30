import { createRouter } from '../createRouter'
import { balanceTypeRouter } from './balanceType'
import { networthRouter } from './networth'
import { trendRouter } from './trend'

export const appRouter = createRouter()
  .merge('networth.', networthRouter)
  .merge('trend.', trendRouter)
  .merge('balanceType.', balanceTypeRouter)

export type AppRouter = typeof appRouter
