import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'

import { AppRouter } from '../server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
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
