import { endOfDay, formatISO } from 'date-fns'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FC, useMemo } from 'react'

import { Money } from '../../@types/Money'
import ActivityIndicator from '../../components/ActivityIndicator'
import Card from '../../components/Card'
import { formatMoneyString } from '../../utils/formatMoney'
import { trpc } from '../../utils/trpc'
import NetworthChart from './NetworthChart'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Networthy</title>
      </Head>

      <Content />
    </>
  )
}

const Content: FC = () => {
  const timestamp = useMemo(() => {
    return formatISO(endOfDay(new Date()))
  }, [])

  const { data, isLoading } = trpc.useQuery([
    'networth.get-by-timestamp',
    { timestamp }
  ])

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (!data) {
    return <span>No data found.</span>
  }

  return (
    <section>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-lg font-bold">Net Worth</h1>
        <span className="text-2xl">
          {formatMoneyString(data.networth.money)}
        </span>
      </div>

      <div className="mb-10">
        <Card>
          <div className="mb-6">
            <WealthRow label="Assets" money={data.assets.money} />
            <WealthRow
              label="Liabilities"
              money={data.liabilitiesTotal.money}
              negative
            />
          </div>

          <div style={{ height: 260 }}>
            <NetworthChart />
          </div>
        </Card>
      </div>

      <div>
        <Link href="/add-balance">
          <a>Add balance</a>
        </Link>
      </div>
    </section>
  )
}

const WealthRow: FC<{ label: string; money: Money; negative?: boolean }> = ({
  label,
  money,
  negative
}) => {
  return (
    <div className="flex justify-between items-center mb-2 last:mb-0">
      <span className="text-xl text-gray-400">{label}</span>

      <div className="flex flex-row items-center">
        <span className="text-lg mr-2">
          {(negative ? '-' : '+') + formatMoneyString(money)}
        </span>

        <div
          className={`rounded-full w-2 h-2 ${
            negative ? 'bg-red-500' : 'bg-green-400'
          }`}
        />
      </div>
    </div>
  )
}

export default Home
