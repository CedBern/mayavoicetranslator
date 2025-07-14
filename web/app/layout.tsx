import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maya Voice Translator',
  description: 'Advanced AI-powered translation platform for Maya and indigenous languages',
  keywords: ['maya', 'translation', 'indigenous languages', 'AI', 'voice'],
  authors: [{ name: 'Maya Voice Translator Team' }],
  openGraph: {
    title: 'Maya Voice Translator',
    description: 'Preserve and revitalize indigenous languages with AI',
    url: 'https://mayatranslator.com',
    siteName: 'Maya Voice Translator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Maya Voice Translator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maya Voice Translator',
    description: 'Preserve and revitalize indigenous languages with AI',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
