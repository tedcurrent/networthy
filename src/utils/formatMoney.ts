export type Money = {
  currency: Intl.NumberFormatOptions['currency']
  value: number
}

export const formatMoney = (money: Money) => {
  const formatter = Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return formatter.format(money.value)
}
