import { format } from 'date-fns'
import * as R from 'ramda'
import React, { FC } from 'react'
import {
  Area,
  AreaChart,
  CartesianAxis,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { TooltipProps } from 'recharts/types/component/Tooltip'

import { formatMoney } from '../utils/formatMoney'

const green = 'var(--color-green-400)'
const gray = 'var(--color-gray-400)'

const data = [
  {
    dateTime: '2022-01-01',
    networth: 4000
  },
  {
    dateTime: '2022-01-03',
    networth: 3000
  },
  {
    dateTime: '2022-01-05',
    networth: 2000
  },
  {
    dateTime: '2022-01-07',
    networth: 2780
  },
  {
    dateTime: '2022-01-11',
    networth: 1890
  },
  {
    dateTime: '2022-01-13',
    networth: null
  },
  {
    dateTime: '2022-01-17',
    networth: null
  }
]

const Chart: FC = () => {
  const lastWithData = R.findLast(val => val.networth !== null, data)

  const unit = '€'

  const currency = 'EUR'

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 15,
          right: 0,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="8"
          strokeOpacity={0.5}
          stroke={gray}
        />
        <defs>
          <linearGradient id="colorNetworth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={green} stopOpacity={0.8} />
            <stop offset="95%" stopColor={green} stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="dateTime"
          tickLine={false}
          axisLine={false}
          stroke={gray}
          tickFormatter={(date: string) => {
            return format(new Date(date), 'LLL d')
          }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          stroke={gray}
          mirror
          tickFormatter={value =>
            formatMoney(
              { value, currency },
              { notation: 'compact', minimumFractionDigits: 0 }
            )
          }
        />

        <Tooltip
          isAnimationActive={false}
          cursor={{ stroke: gray, strokeWidth: 1 }}
          content={CustomTooltip}
        />

        <Area
          type="monotone"
          dataKey="networth"
          isAnimationActive={false}
          stroke={green}
          strokeWidth={3}
          fill="url(#colorNetworth)"
          unit={unit}
          activeDot={{
            r: 5,
            fill: green,
            stroke: green,
            strokeWidth: 3
          }}
        />

        {lastWithData && (
          <ReferenceDot
            x={lastWithData.dateTime}
            y={lastWithData.networth ?? undefined}
            fillOpacity={1}
            fill={green}
            stroke={green}
            strokeWidth={3}
            r={3}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

type CustomTooltipProps = TooltipProps<number, string>

const CustomTooltip: FC<CustomTooltipProps> = ({ payload }) => {
  const value = R.head(payload ?? [])

  if (!value) {
    return null
  }

  // const formatted = formatMoney({
  //   value: value.
  // })
  return (
    <div className="border-white rounded-sm border-2 px-2 bg-slate-700">
      <span className="text-sm">
        {payload?.map(x => (x.value?.toString() ?? '') + (x.unit ?? ''))}
      </span>
    </div>
  )
}

export default Chart
