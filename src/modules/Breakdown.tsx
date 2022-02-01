import React, { FC } from 'react'

import { Money } from '../@types/Money'
import Card from '../components/Card'
import { balanceTypeLabels, BalanceTypeName } from '../utils/balanceType'
import { formatMoneyString } from '../utils/money'

type BalanceType = {
  cuid: string
  money: Money
  name: string
}

type Props = {
  assets: BalanceType[]
  liabilities: BalanceType[]
}

const Breakdown: FC<Props> = ({ assets, liabilities }) => {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">Breakdown</h2>
      <Card>
        {assets.map(x => (
          <Row
            key={x.cuid}
            label={balanceTypeLabels[x.name as BalanceTypeName]}
            money={x.money}
          />
        ))}

        {liabilities.map(x => (
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
