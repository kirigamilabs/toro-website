import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'

/*import { Providers } from './providers'*/

import { ChakraProvider } from '@chakra-ui/react'

const mmono = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Toro',
  description: 'torotorotoro',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
        <body className={mmono.className}>
              <ChakraProvider>
                {children}   
              </ChakraProvider>
        </body>
      </html>
  )
}