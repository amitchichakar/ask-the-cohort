import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ask the Cohort',
  description: 'A Q&A board for your cohort — ask questions, upvote the best ones.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-zinc-950 text-white min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
