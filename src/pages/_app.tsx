import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import Navbar from '../components/Navbar'
import { AppRouter } from '../server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="description" content="Networthy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mt-20">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default withTRPC<AppRouter>({
  config() {
    if (process.browser) {
      return {
        url: '/api/trpc'
      }
    }

    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'

    return {
      url
    }
  },

  ssr: false
})(MyApp)
