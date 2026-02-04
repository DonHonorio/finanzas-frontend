'use client'

import { cn } from "@/src/lib/utils"
import { useEffect, useState } from "react"

export type FrequencyValue = "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom"
export type FrequencyUnit = "days" | "weeks" | "months" | "years"

type Props = {
  frequency: string
  onChange: (value: string) => void
  name?: string
  customCountName?: string
  customUnitName?: string
  className?: string
}

const parseRRule = (rrule: string): { value: FrequencyValue; customCount: string; customUnit: FrequencyUnit } => {
  const upper = (rrule || "").toUpperCase()
  if (!upper) return { value: "once", customCount: "", customUnit: "days" }

  if (upper.includes("FREQ=DAILY;COUNT=1")) return { value: "once", customCount: "", customUnit: "days" }

  const freqMatch = upper.match(/FREQ=([A-Z]+)/)
  const intervalMatch = upper.match(/INTERVAL=(\d+)/)

  const mapFreqToValue: Record<string, FrequencyValue> = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly"
  }

  const freq = freqMatch?.[1]
  const interval = intervalMatch?.[1]

  if (freq && !interval && mapFreqToValue[freq]) {
    return { value: mapFreqToValue[freq], customCount: "", customUnit: "weeks" }
  }

  if (freq && interval) {
    const mapFreqToUnit: Record<string, FrequencyUnit> = {
      DAILY: "days",
      WEEKLY: "weeks",
      MONTHLY: "months",
      YEARLY: "years"
    }
    return {
      value: "custom",
      customCount: interval,
      customUnit: mapFreqToUnit[freq] || "weeks"
    }
  }

  return { value: "custom", customCount: "", customUnit: "weeks" }
}

const buildRRule = (value: FrequencyValue, customCount: string, customUnit: FrequencyUnit) => {
  const interval = Number(customCount)
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
}

export function FrequencyField({
  frequency,
  onChange,
  name,
  customCountName,
  customUnitName,
  className
}: Props) {
  const parsed = parseRRule(frequency)
  const [value, setValue] = useState<FrequencyValue>(parsed.value)
  const [customCount, setCustomCount] = useState(parsed.customCount)
  const [customUnit, setCustomUnit] = useState<FrequencyUnit>(parsed.customUnit)

  useEffect(() => {
    const next = parseRRule(frequency)
    setValue(next.value)
    setCustomCount(next.customCount)
    setCustomUnit(next.customUnit)
  }, [frequency])

  const isCustom = value === "custom"

  const commit = (nextValue: FrequencyValue, nextCount = customCount, nextUnit = customUnit) => {
    onChange(buildRRule(nextValue, nextCount, nextUnit))
  }

  const handleValueChange = (nextValue: FrequencyValue) => {
    setValue(nextValue)
    if (nextValue === "custom") {
      // Inicializar valores para "custom" si no están definidos
      const initialCount = customCount || "1"
      const initialUnit = customUnit || "weeks"
      setCustomCount(initialCount)
      setCustomUnit(initialUnit)
      commit(nextValue, initialCount, initialUnit)
    } else {
      commit(nextValue)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {name && <input type="hidden" name={name} value={buildRRule(value, customCount, customUnit)} />}

      <select
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
        value={value}
        onChange={(event) => handleValueChange(event.target.value as FrequencyValue)}
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
            onChange={(event) => {
              const next = event.target.value
              setCustomCount(next)
              commit(value, next, customUnit)
            }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
          />
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
            name={customUnitName}
            value={customUnit}
            onChange={(event) => {
              const next = event.target.value as FrequencyUnit
              setCustomUnit(next)
              commit(value, customCount, next)
            }}
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
