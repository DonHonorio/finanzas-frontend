import { getLocale } from "next-intl/server"
import type { AbstractIntlMessages } from "next-intl"
import { BienvenidaPageClient } from "@/src/components/pages/bienvenida-page-client"
import { APP_LOCALES, AppLocale } from "@/src/i18n/config"

export default async function BienvenidaPage() {
    const initialLocale = await getLocale() as AppLocale

    // Precarga todos los locales para que el selector de idioma funcione sin recargar la página ni tocar la cookie
    const allMessages = Object.fromEntries(
        await Promise.all(
            APP_LOCALES.map(async (locale) => {
                const messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages
                return [locale, messages]
            })
        )
    ) as Record<AppLocale, AbstractIntlMessages>

    return <BienvenidaPageClient initialLocale={initialLocale} allMessages={allMessages} />
}
