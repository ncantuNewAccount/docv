import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DocV - GED Souveraine et Sécurisée',
  description: 'DocV propose une approche révolutionnaire de la gestion d\'identité, garantissant sécurité, souveraineté et conformité dans la gestion de vos documents et processus métier.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
