import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: 'Bio List — Galerija',
  description: 'Odaberite vaše omiljene fotografije',
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
