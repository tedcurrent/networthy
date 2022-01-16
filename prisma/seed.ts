import pkg from '@prisma/client'
const { PrismaClient, BalanceCategory } = pkg

const balanceTypes = [
  {
    name: 'savings-account',
    category: BalanceCategory.ASSET
  },
  {
    name: 'checking-account',
    category: BalanceCategory.ASSET
  },
  {
    name: 'real-estate',
    category: BalanceCategory.ASSET
  },
  {
    name: 'stocks',
    category: BalanceCategory.ASSET
  },
  {
    name: 'private-equity',
    category: BalanceCategory.ASSET
  },
  {
    name: 'mortgage',
    category: BalanceCategory.LIABILITY
  }
]

const balanceItems = [
  {
    value: 10000,
    balanceTypeId: 1
  },
  {
    value: 500,
    balanceTypeId: 2
  },
  {
    value: 256000,
    balanceTypeId: 3
  },
  {
    value: 75000,
    balanceTypeId: 4
  },
  {
    value: 42300,
    balanceTypeId: 5
  },
  {
    value: 219000,
    balanceTypeId: 6
  }
]

const prisma = new PrismaClient()

const main = async () => {
  const cats = prisma.balanceType.createMany({
    data: balanceTypes
  })

  const sources = prisma.balanceItem.createMany({
    data: balanceItems
  })

  return Promise.all([cats, sources])
}

try {
  main()
} catch (e) {
  console.log(e)
  process.exit(1)
} finally {
  prisma.$disconnect()
}
