"use client"

import { useTranslations } from "next-intl"

type DataLoadingProps = {
  label: string
}

// loader básico -> se cambiará en un futuro
export function DataLoading({ label }: DataLoadingProps) {
  const t = useTranslations("CommonStatus")

  return (
    <div className="p-10 text-center text-muted-foreground">
      {t("loading", { label })}
    </div>
  )
}
