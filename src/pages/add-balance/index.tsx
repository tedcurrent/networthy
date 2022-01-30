import type { NextPage } from 'next'
import Head from 'next/head'
import * as R from 'ramda'
import React, { FC, useMemo } from 'react'

import ActivityIndicator from '../../components/ActivityIndicator'
import { keys } from '../../utils/keys'
import { titlecase } from '../../utils/titlecase'
import { InferQueryOutput, trpc } from '../../utils/trpc'

const balanceTypeLabels = {
  'checking-account': 'Checking account',
  mortgage: 'Mortgage',
  'private-equity': 'Private equity',
  'real-estate': 'Real estate',
  'savings-account': 'Savings account',
  stocks: 'Stocks'
}

type BalanceTypeName = keyof typeof balanceTypeLabels

type BalanceType =
  InferQueryOutput<'balanceType.get-all'>['balanceTypes'][number]

const typeAsOption = (balanceType: BalanceType) => {
  return {
    value: balanceType.cuid,
    label: balanceTypeLabels[balanceType.name as BalanceTypeName]
  }
}

const AddBalance: NextPage = () => {
  return (
    <>
      <Head>
        <title>Networthy - Add balance</title>
      </Head>

      <section>
        <h1 className="text-lg font-bold">Add balance</h1>

        <Form />
      </section>
    </>
  )
}

const Form = () => {
  const { data, isLoading } = trpc.useQuery(['balanceType.get-all'])

  const typesPerCategory = useMemo(() => {
    return R.pipe(
      R.filter((x: BalanceType) =>
        keys(balanceTypeLabels).includes(x.name as BalanceTypeName)
      ),
      R.groupBy(x => x.category)
    )(data?.balanceTypes ?? [])
  }, [data])

  const categoryOptions = useMemo(() => {
    return keys(typesPerCategory).map(x => ({
      label: titlecase(x),
      value: x
    }))
  }, [typesPerCategory])

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <form>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="value">Value</label>
          <input name="value" type="text" className="text-black" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="category">Category</label>
          <select name="category" className="text-black">
            <option>Select category</option>
            {categoryOptions.map(x => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </select>
        </div>

        <SelectType category="ASSET" typesPerCategory={typesPerCategory} />

        <button type="submit">Add</button>
      </div>
    </form>
  )
}

type SelectTypeProps = {
  category: BalanceType['category']
  typesPerCategory: Record<BalanceType['category'], BalanceType[]>
}

const SelectType: FC<SelectTypeProps> = ({ category, typesPerCategory }) => {
  const options = useMemo(() => {
    return typesPerCategory[category]?.map(typeAsOption) ?? []
  }, [category, typesPerCategory])

  return (
    <div className="flex flex-col">
      <label htmlFor="category">Category</label>
      <select name="category" className="text-black">
        <option>Select type</option>
        {options.map(x => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AddBalance
