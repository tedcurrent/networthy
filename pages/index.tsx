import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Networthy</title>
        <meta name="description" content="Networthy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold">Networthy</h1>
      </main>
    </>
  )
}

export default Home
