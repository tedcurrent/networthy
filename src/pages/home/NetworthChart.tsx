import { format } from 'date-fns'
import * as R from 'ramda'
import React, { FC } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'
import { TooltipProps } from 'recharts/types/component/Tooltip'

import ActivityIndicator from '../../components/ActivityIndicator'
import { formatMoneyString } from '../../utils/formatMoney'
import { trpc } from '../../utils/trpc'

const green = 'var(--color-green-400)'
const gray = 'var(--color-gray-400)'

const NetworthChart: FC = () => {
  const { data, isLoading } = trpc.useQuery(['trend.get'])

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (!data) {
    return <span>No data found.</span>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data.trend}
        margin={{
          top: 15,
          right: 0,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="6 6"
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
          tickFormatter={(date: string) => format(new Date(date), 'MM/yyyy')}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          stroke={gray}
          mirror
          tickFormatter={value =>
            formatMoneyString(
              { value, currency: data.currency },
              {
                currency: data.currency,
                notation: 'compact',
                minimumFractionDigits: 0
              }
            )
          }
        />

        <Tooltip
          isAnimationActive={false}
          cursor={{ stroke: gray, strokeWidth: 1 }}
          content={props => (
            <CustomTooltip {...props} currency={data.currency} />
          )}
        />

        <Area
          type="monotone"
          dataKey="networth"
          isAnimationActive={false}
          stroke={green}
          strokeWidth={3}
          fill="url(#colorNetworth)"
          fillOpacity={0.7}
          activeDot={{
            r: 3,
            fill: green,
            stroke: green,
            strokeWidth: 3
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

type CustomTooltipProps = { currency: string } & TooltipProps<
  ValueType,
  NameType
>

const CustomTooltip: FC<CustomTooltipProps> = ({ currency, payload }) => {
  const value = R.head(payload ?? [])

  if (!value) {
    return null
  }

  const formattedMoney = formatMoneyString({
    value: typeof value.value === 'number' ? value.value : 0,
    currency
  })

  return (
    <div className="border-white rounded-sm border-2 px-2 bg-slate-700">
      <span className="text-sm">{formattedMoney}</span>
    </div>
  )
}

export default NetworthChart
