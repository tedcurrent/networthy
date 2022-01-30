import { TRPCError } from '@trpc/server'
import * as yup from 'yup'

import { createRouter } from '../createRouter'

export const balanceItemRouter = createRouter().mutation('add', {
  input: yup.object({
    value: yup.number().min(0).required(),
    balanceTypeCuid: yup.string().required()
  }),
  resolve: async ({ input, ctx }) => {
    const balanceType = await ctx.prisma.balanceType.findFirst({
      where: {
        cuid: input.balanceTypeCuid
      }
    })

    if (!balanceType) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Balance type not found'
      })
    }

    await ctx.prisma.balanceItem.create({
      data: {
        value: input.value,
        balanceType: {
          connect: {
            id: balanceType.id
          }
        }
      }
    })
  }
})
