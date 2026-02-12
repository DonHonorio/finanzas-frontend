import type { Metadata } from "next"
import "./globals.css"
import { Outfit } from 'next/font/google'

const outfit = Outfit({subsets: ['latin']})

export const metadata: Metadata = {
  title: "Finanzas Personales",
  description: "Aplicación para gestionar tus finanzas personales e inversiones",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={outfit.className}
      >
        {children}
      </body>
    </html>
  )
}
