import type { NextPage } from 'next'
import Head from 'next/head'
import { FC } from 'react'

import Card from '../components/Card'
import { formatMoney, Money } from '../utils/formatMoney'

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
  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-lg font-bold">Net Worth</h1>
        <span className="text-2xl">
          {formatMoney({ value: 12345.0, currency: 'EUR' })}
        </span>
      </div>

      <Card>
        <WealthRow label="Assets" money={{ value: 69420.0, currency: 'EUR' }} />
        <WealthRow
          label="Liabilities"
          money={{ value: -6667.0, currency: 'EUR' }}
        />
      </Card>
    </div>
  )
}

const WealthRow: FC<{ label: string; money: Money }> = ({ label, money }) => {
  const isPositive = money.value >= 0

  return (
    <div className="flex justify-between items-center mb-2 last:mb-0">
      <span className="text-xl text-gray-400">{label}</span>

      <div className="flex flex-row items-center">
        <span className="text-lg mr-2">
          {(isPositive ? '+' : '') + formatMoney(money)}
        </span>

        <div
          className={`rounded-full w-2 h-2 ${
            isPositive ? 'bg-green-600' : 'bg-red-500'
          }`}
        />
      </div>
    </div>
  )
}

export default Home
