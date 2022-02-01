import { Money } from '../@types/Money'

export const DEFAULT_CURRENCY = 'EUR'

export const makeMoney = (value: number, currency: string): Money => {
  return { value, currency }
}

export const formatMoneyString = (
  money: Money,
  opts?: Intl.NumberFormatOptions
) => {
  const formatter = Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts
  })

  return formatter.format(money.value)
}
