import { createRouter } from '../createRouter'
import { networthRouter } from './networth'
import { trendRouter } from './trend'

export const appRouter = createRouter()
  .merge('networth.', networthRouter)
  .merge('trend.', trendRouter)

export type AppRouter = typeof appRouter
