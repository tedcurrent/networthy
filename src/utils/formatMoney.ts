export type Money = {
  currency: Intl.NumberFormatOptions['currency']
  value: number
}

export const formatMoney = (money: Money, opts?: Intl.NumberFormatOptions) => {
  const formatter = Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts
  })

  return formatter.format(money.value)
}
