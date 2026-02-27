'use client'

import { useState } from "react"
import { NextIntlClientProvider } from "next-intl"
import type { AbstractIntlMessages } from "next-intl"
import { AppLocale } from "@/src/i18n/config"
import { BienvenidaContent } from "./bienvenida-content"

type Props = {
    initialLocale: AppLocale
    allMessages: Record<AppLocale, AbstractIntlMessages>
}

// Pantalla de bienvenida: wrapper que gestiona el locale local (sin persistir cookie)
// y provee un NextIntlClientProvider anidado para aislar el cambio de idioma.
export function BienvenidaPageClient({ initialLocale, allMessages }: Props) {
    const [locale, setLocale] = useState<AppLocale>(initialLocale)

    return (
        <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
            <BienvenidaContent locale={locale} onLocaleChange={setLocale} />
        </NextIntlClientProvider>
    )
}
