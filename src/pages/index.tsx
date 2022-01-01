import { format, formatISO, startOfHour } from 'date-fns'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FC } from 'react'

import { formatMoney } from '../utils/formatMoney'
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
        <span className="text-2xl font-bold">Networthy</span>
      </nav>

      <main className="container mt-24">
        <h1 className="text-2xl mb-4">Your networth</h1>
        <Content />
      </main>
    </>
  )
}

const Content: FC = () => {
  const { data, isLoading } = trpc.useQuery([
    'get-networth-by-timestamp',
    { timestamp: formatISO(startOfHour(new Date())) }
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
        <div className="mb-2">
          <h2>Current</h2>
          <h3 className="text-4xl font-bold text-green-400">
            {formatMoney(data.networth.money)}
          </h3>
          <Diff
            value={
              data.networth.money.value / data.previousNetworth.money.value
            }
          />

          <p className="text-sm text-gray-500">
            {format(new Date(data.networth.timestamp), 'PPP')}
          </p>
        </div>

        <div>
          <h2>Previous</h2>
          <h3 className="text-2xl font-bold text-gray-400">
            {formatMoney(data.previousNetworth.money)}
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(data.previousNetworth.timestamp), 'PPP')}
          </p>
        </div>
      </div>
    )
  }

  return null
}

const Diff: FC<{ value: number }> = ({ value }) => {
  const isPositive = value > 1

  const formattedValue = () => ((value - 1) * 100).toFixed(2)

  return (
    <span className={isPositive ? `text-green-200` : 'text-red-200'}>
      {isPositive ? `+${formattedValue()}` : `${formattedValue()}`}%
    </span>
  )
}

export default Home
