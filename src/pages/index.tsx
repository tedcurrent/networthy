import { formatISO, startOfHour } from 'date-fns'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FC } from 'react'

import Card from '../components/Card'
import Chart from '../components/Chart'
import { formatMoney, Money } from '../utils/formatMoney'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Networthy</title>
        <meta name="description" content="Networthy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="container mb-4 mt-4">
        <span className="text-md font-bold">Networthy</span>
      </nav>

      <main className="container mt-20">
        <Content />
      </main>
    </>
  )
}

const Content: FC = () => {
  const { data, isLoading } = trpc.useQuery([
    'get-networth-by-timestamp',
    {
      timestamp: formatISO(new Date())
    }
  ])

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  if (data) {
    return (
      <div>
        <div className="flex justify-between mb-4 items-center">
          <h1 className="text-lg font-bold">Net Worth</h1>
          <span className="text-2xl">{formatMoney(data.networth.money)}</span>
        </div>

        <div className="mb-10">
          <Card>
            <WealthRow label="Assets" money={data.assets.money} />
            <WealthRow
              label="Liabilities"
              money={data.liabilitiesTotal.money}
              negative
            />
          </Card>
        </div>

        <Card>
          <div style={{ height: 260 }}>
            <Chart />
          </div>
        </Card>
      </div>
    )
  }

  return null
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
          {(negative ? '-' : '+') + formatMoney(money)}
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
