import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: 'Bio List — Galerija',
  description: 'Galerija fotografija brenda Bio List. Pregledajte i odaberite vaše omiljene fotografije.',
  openGraph: {
    title: 'Bio List — Galerija',
    description: 'Galerija fotografija brenda Bio List. Pregledajte i odaberite vaše omiljene fotografije.',
    url: 'https://bio-list-galerija.vercel.app',
    siteName: 'Bio List Galerija',
    images: [
      {
        url: 'https://bio-list-galerija.vercel.app/og-image.jpg',
        secureUrl: 'https://bio-list-galerija.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bio List logo',
        type: 'image/jpeg',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bio List — Galerija',
    description: 'Galerija fotografija brenda Bio List. Pregledajte i odaberite vaše omiljene fotografije.',
    images: ['https://bio-list-galerija.vercel.app/og-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className={`${inter.variable} ${playfair.variable} bg-cream-100`}>
        {children}
      </body>
    </html>
  )
}
