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
        url: 'https://bio-list-galerija.vercel.app/og-image.png',
        width: 748,
        height: 667,
        alt: 'Bio List logo',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
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
