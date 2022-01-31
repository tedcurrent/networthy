import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'

import { AppRouter } from '../server/trpc'

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

    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'

    return {
      url
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false
})(MyApp)
