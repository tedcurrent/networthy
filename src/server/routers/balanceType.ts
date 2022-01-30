import { z } from 'zod'

import { createRouter } from '../createRouter'

export const balanceTypeRouter = createRouter().query('get-all', {
  input: z.void(),
  resolve: async ({ ctx }) => {
    const balanceTypes = await ctx.prisma.balanceType.findMany({
      select: {
        cuid: true,
        name: true,
        category: true
      }
    })

    return { balanceTypes }
  }
})
