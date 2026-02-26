"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/src/lib/utils"
import { AppLocale, APP_LOCALES } from "@/src/i18n/config"
import { useLanguagePreference } from "@/src/hooks/use-language-preference"

type LanguageSelectorProps = {
  value?: AppLocale
  onChange?: (locale: AppLocale) => void
  name?: string
  label?: string
  persistOnChange?: boolean
  disabled?: boolean
  className?: string
  selectClassName?: string
}

function localeLabel(locale: AppLocale, t: ReturnType<typeof useTranslations>) {
  if (locale === "es") return t("spanish")
  return t("english")
}

export function LanguageSelector({
  value,
  onChange,
  name,
  label,
  persistOnChange = false,
  disabled = false,
  className,
  selectClassName,
}: LanguageSelectorProps) {
  const t = useTranslations("Language")
  const localeFromContext = useLocale() as AppLocale
  const [internalLocale, setInternalLocale] = useState<AppLocale>(value ?? localeFromContext)
  const { changeLocale, isPending } = useLanguagePreference()
  const currentLocale = value ?? internalLocale

  const handleChange = async (nextLocale: AppLocale) => {
    if (!value) {
      setInternalLocale(nextLocale)
    }
    onChange?.(nextLocale)

    if (persistOnChange) {
      await changeLocale(nextLocale)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-[15px] font-semibold text-gray-700 mb-1">
        {label ?? t("label")}
      </label>
      <select
        name={name}
        value={currentLocale}
        onChange={(event) => void handleChange(event.target.value as AppLocale)}
        disabled={disabled || isPending}
        className={cn(
          "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed",
          selectClassName
        )}
      >
        {APP_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabel(locale, t)}
          </option>
        ))}
      </select>
    </div>
  )
}
