export const balanceTypeLabels = {
  'checking-account': 'Checking account',
  mortgage: 'Mortgage',
  'private-equity': 'Private equity',
  'real-estate': 'Real estate',
  'savings-account': 'Savings account',
  stocks: 'Stocks'
}

export type BalanceTypeName = keyof typeof balanceTypeLabels
