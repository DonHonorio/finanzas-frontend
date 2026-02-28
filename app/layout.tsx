import type { Metadata } from "next"
import "./globals.css"
import 'react-toastify/dist/ReactToastify.css'
import { Outfit } from 'next/font/google'
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

const outfit = Outfit({subsets: ['latin']})

export const metadata: Metadata = {
  title: "Personal Finance",
  description: "Application to manage personal finances and investments",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale ?? "en"}>
      <body
        className={outfit.className}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
