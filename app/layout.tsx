import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces, Geist_Mono, Crimson_Text } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
})
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const crimsonText = Crimson_Text({ subsets: ['latin'], variable: '--font-crimson-text', weight: ['400', '600'] })

export const metadata: Metadata = {
  title: 'Wellspring Flow — Donations to Real Community Impact',
  description:
    'A premium operations system for nonprofit donation intake, inventory, distribution, and monthly impact reporting.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#fdf8f4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${inter.variable} ${fraunces.variable} ${geistMono.variable} ${crimsonText.variable}`}
    >
      <body className="font-sans antialiased relative overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
