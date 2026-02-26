import { getRequestConfig } from "next-intl/server"
import { getLocaleFromCookie } from "./cookies"

export default getRequestConfig(async () => {
  const locale = await getLocaleFromCookie()

  return {
    locale,
    // Carga solo el namespace del locale actual por request.
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
