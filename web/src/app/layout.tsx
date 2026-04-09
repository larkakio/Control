import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Orbitron } from 'next/font/google'
import { cookieToInitialState } from 'wagmi'

import { Providers } from '@/components/providers'
import { config } from '@/wagmi-config'

import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-control',
  display: 'swap',
})

const baseAppId = process.env.NEXT_PUBLIC_BASE_APP_ID

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : new URL('http://localhost:3000'),
  title: 'Control — Sector Run',
  description: 'Neon grid puzzle on Base. Swipe to move. Daily check-in.',
  icons: {
    icon: '/control-app-icon.jpg',
  },
  openGraph: {
    images: ['/control-app-thumbnail.jpg'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const cookieStr = headerList.get('cookie') ?? ''
  const initialState = cookieToInitialState(config, cookieStr)

  return (
    <html lang="en" className={`${orbitron.variable} h-full`}>
      <head>
        {baseAppId ? (
          <meta name="base:app_id" content={baseAppId} />
        ) : null}
      </head>
      <body className="min-h-full bg-[#030308] font-sans text-zinc-100 antialiased">
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.15) 2px, rgba(0,255,255,0.15) 3px)',
          }}
          aria-hidden
        />
        <Providers initialState={initialState}>
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
