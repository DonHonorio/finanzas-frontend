'use client'

import { cn } from "@/src/lib/utils"

export type FrequencyValue = "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom"
export type FrequencyUnit = "days" | "weeks" | "months" | "years"

type Props = {
  value: FrequencyValue
  onChange: (value: FrequencyValue) => void
  customCount: string
  onCustomCountChange: (value: string) => void
  customUnit: FrequencyUnit
  onCustomUnitChange: (value: FrequencyUnit) => void
  name?: string
  customCountName?: string
  customUnitName?: string
  className?: string
}

export function FrequencyField({
  value,
  onChange,
  customCount,
  onCustomCountChange,
  customUnit,
  onCustomUnitChange,
  name,
  customCountName,
  customUnitName,
  className
}: Props) {
  const isCustom = value === "custom"
  const interval = Number(customCount)

  const rruleValue = (() => {
    switch (value) {
      case "once":
        return "FREQ=DAILY;COUNT=1"
      case "daily":
        return "FREQ=DAILY"
      case "weekly":
        return "FREQ=WEEKLY"
      case "monthly":
        return "FREQ=MONTHLY"
      case "yearly":
        return "FREQ=YEARLY"
      case "custom": {
        if (!Number.isFinite(interval) || interval <= 0) return ""
        const freqByUnit: Record<FrequencyUnit, string> = {
          days: "DAILY",
          weeks: "WEEKLY",
          months: "MONTHLY",
          years: "YEARLY"
        }
        return `FREQ=${freqByUnit[customUnit]};INTERVAL=${interval}`
      }
      default:
        return ""
    }
  })()

  return (
    <div className={cn("space-y-2", className)}>
      {name && (
        <input type="hidden" name={name} value={rruleValue} />
      )}
      <select
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
        value={value}
        onChange={(event) => onChange(event.target.value as FrequencyValue)}
      >
        <option value="once">Una sola vez</option>
        <option value="daily">Diariamente</option>
        <option value="weekly">Semanalmente</option>
        <option value="monthly">Mensualmente</option>
        <option value="yearly">Anualmente</option>
        <option value="custom">Personalizado</option>
      </select>

      {isCustom && (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            name={customCountName}
            value={customCount}
            onChange={(event) => onCustomCountChange(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
          />
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
            name={customUnitName}
            value={customUnit}
            onChange={(event) => onCustomUnitChange(event.target.value as FrequencyUnit)}
          >
            <option value="days">Días</option>
            <option value="weeks">Semanas</option>
            <option value="months">Meses</option>
            <option value="years">Años</option>
          </select>
        </div>
      )}
    </div>
  )
}
