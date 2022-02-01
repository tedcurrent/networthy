import React, { FC } from 'react'

import { Money } from '../../@types/Money'
import Card from '../../components/Card'
import { balanceTypeLabels, BalanceTypeName } from '../../utils/balanceType'
import { formatMoneyString } from '../../utils/money'
import { InferQueryOutput } from '../../utils/trpc'

type Props = {
  breakdown: InferQueryOutput<'networth.get-by-timestamp'>['breakdown']
}

const Breakdown: FC<Props> = ({ breakdown }) => {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">Breakdown</h2>
      <Card>
        {breakdown?.assets.map(x => (
          <Row
            key={x.cuid}
            label={balanceTypeLabels[x.name as BalanceTypeName]}
            money={x.money}
          />
        ))}

        {breakdown?.liabilities.map(x => (
          <Row
            key={x.cuid}
            label={balanceTypeLabels[x.name as BalanceTypeName]}
            money={x.money}
            negative
          />
        ))}
      </Card>
    </>
  )
}

type RowProps = {
  label: string
  money: Money
  negative?: boolean
}

const Row: FC<RowProps> = ({ label, money, negative }) => {
  return (
    <div className="flex justify-between text mb-2 last:mb-0">
      <span>{label}</span>
      <span className={negative ? 'text-red-500' : 'text-green-400'}>
        {(negative ? '-' : '+') + formatMoneyString(money)}
      </span>
    </div>
  )
}

export default Breakdown
