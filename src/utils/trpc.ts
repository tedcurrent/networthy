import { createReactQueryHooks } from '@trpc/react'

import { AppRouter } from '../server/trpc'

export const trpc = createReactQueryHooks<AppRouter>()
