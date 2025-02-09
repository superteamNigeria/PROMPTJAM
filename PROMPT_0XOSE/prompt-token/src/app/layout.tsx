import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '../components/WalletContextProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PROMPT-0XOSE Token',
  description: 'Solana token interface for PROMPT-0XOSE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
