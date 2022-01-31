import { ErrorMessage, Field, Form, Formik } from 'formik'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import React, { useMemo } from 'react'
import * as yup from 'yup'

import ActivityIndicator from '../../components/ActivityIndicator'
import { keys } from '../../utils/keys'
import { titlecase } from '../../utils/titlecase'
import { InferQueryOutput, trpc } from '../../utils/trpc'

const addBalanceSchema = yup.object({
  value: yup.number().min(0).required('Value required.'),
  balanceTypeCuid: yup.string().required('Type required.')
})

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

const AddBalance: NextPage = () => {
  return (
    <>
      <Head>
        <title>Networthy - Add balance</title>
      </Head>

      <section>
        <h1 className="text-lg font-bold mb-4">Add balance</h1>

        <Content />
      </section>
    </>
  )
}

const Content = () => {
  const context = trpc.useContext()
  const router = useRouter()
  const { data, isLoading } = trpc.useQuery(['balanceType.get-all'])
  const mutation = trpc.useMutation(['balanceItem.add'], {
    onSuccess: () => {
      context.invalidateQueries(['networth.get-by-timestamp'])
      context.invalidateQueries(['trend.get'])
      router.back()
    }
  })

  const typesPerCategory = useMemo(() => {
    return R.pipe(
      R.filter((x: BalanceType) =>
        keys(balanceTypeLabels).includes(x.name as BalanceTypeName)
      ),
      R.map(x => ({
        value: x.cuid,
        label: balanceTypeLabels[x.name as BalanceTypeName],
        category: x.category
      })),
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
    <Formik
      initialValues={{
        value: 0,
        category: 'ASSET' as const,
        balanceTypeCuid: ''
      }}
      validationSchema={addBalanceSchema}
      onSubmit={async ({ value, balanceTypeCuid }) => {
        await mutation.mutateAsync({ value, balanceTypeCuid })
      }}
    >
      {({ values, isSubmitting, errors }) => (
        <Form>
          <div className="flex flex-col mb-2">
            <label htmlFor="value">Value</label>
            <Field name="value" type="number" className="text-black" />
            <ErrorMessage name="value" component="div" />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="category">Category</label>
            <Field name="category" as="select" className="text-black">
              <option value="">Select category</option>
              {categoryOptions.map(x => (
                <option key={x.value} value={x.value}>
                  {x.label}
                </option>
              ))}
            </Field>
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="balanceTypeCuid">Type</label>
            <Field name="balanceTypeCuid" as="select" className="text-black">
              <option value="">Select type</option>
              {values.category &&
                typesPerCategory[values.category]?.map(x => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
            </Field>
            <ErrorMessage name="balanceTypeCuid" component="div" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || keys(errors).length > 0}
          >
            Add
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default AddBalance
