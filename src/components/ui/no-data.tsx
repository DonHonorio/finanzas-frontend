"use client"

import { useTranslations } from "next-intl"

type NoDataProps = {
  label: string
  year: number
}

// no hay datos que mostrar pero no hay error
export function NoData({ label, year }: NoDataProps) {
  const t = useTranslations("CommonStatus")

  return (
    <div className="p-10 text-center text-muted-foreground">
      {t("noData", { label, year })}
    </div>
  )
}
