'use client'

import { cn } from "@/src/lib/utils"
import { useEffect, useState } from "react"

export type FrequencyValue = "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom"
export type FrequencyUnit = "days" | "weeks" | "months" | "years"

type Props = {
  frequency: string        // Formato RRULE (ej: "FREQ=WEEKLY;INTERVAL=2")
  onChange: (value: string) => void
  name?: string            // Para formularios: nombre del campo RRULE completo
  customCountName?: string // Para formularios: nombre del campo "cada X"
  customUnitName?: string  // Para formularios: nombre del campo unidad (días/semanas/etc)
  className?: string
}

// Convierte un string RRULE (formato estándar de calendario) a valores que el componente puede manejar
// Ejemplos:
// - "FREQ=WEEKLY" → {value:"weekly", customCount:"", customUnit:"weeks"}
// - "FREQ=MONTHLY;INTERVAL=2" → {value:"custom", customCount:"2", customUnit:"months"}
const parseRRule = (rrule: string): { value: FrequencyValue; customCount: string; customUnit: FrequencyUnit } => {
  const upper = (rrule || "").toUpperCase()
  if (!upper) return { value: "once", customCount: "", customUnit: "days" }

  // Caso especial: "FREQ=DAILY;COUNT=1" significa "una sola vez" (no recurrente)
  if (upper.includes("FREQ=DAILY;COUNT=1")) return { value: "once", customCount: "", customUnit: "days" }

  // Extrae la frecuencia (DAILY, WEEKLY, etc.) y el intervalo (número) usando regex
  const freqMatch = upper.match(/FREQ=([A-Z]+)/)
  const intervalMatch = upper.match(/INTERVAL=(\d+)/)

  // Mapea valores RRULE a valores del componente
  const mapFreqToValue: Record<string, FrequencyValue> = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly"
  }

  const freq = freqMatch?.[1]
  const interval = intervalMatch?.[1]

  // Si hay frecuencia PERO NO intervalo → opción simple (daily, weekly, etc.)
  if (freq && !interval && mapFreqToValue[freq]) {
    return { value: mapFreqToValue[freq], customCount: "", customUnit: "weeks" }
  }

  // Si hay frecuencia CON intervalo → opción personalizada
  if (freq && interval) {
    const mapFreqToUnit: Record<string, FrequencyUnit> = {
      DAILY: "days",
      WEEKLY: "weeks",
      MONTHLY: "months",
      YEARLY: "years"
    }
    return {
      value: "custom",          // Siempre "custom" cuando hay intervalo
      customCount: interval,    // El número del intervalo (ej: "2" para cada 2 semanas)
      customUnit: mapFreqToUnit[freq] || "weeks"
    }
  }

  // Fallback para RRULEs desconocidos o mal formados
  return { value: "custom", customCount: "", customUnit: "weeks" }
}

// Convierte valores del componente a RRULE string
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
  // Estados internos para manejar la UI
  const parsed = parseRRule(frequency)
  const [value, setValue] = useState<FrequencyValue>(parsed.value)
  const [customCount, setCustomCount] = useState(parsed.customCount)
  const [customUnit, setCustomUnit] = useState<FrequencyUnit>(parsed.customUnit)

  // Sincroniza estados internos cuando cambia la prop frequency externa
  useEffect(() => {
    const next = parseRRule(frequency)
    setValue(next.value)
    setCustomCount(next.customCount)
    setCustomUnit(next.customUnit)
  }, [frequency])

  const isCustom = value === "custom"

  // Actualiza el valor RRULE y llama a onChange
  const commit = (nextValue: FrequencyValue, nextCount = customCount, nextUnit = customUnit) => {
    onChange(buildRRule(nextValue, nextCount, nextUnit))
  }

  const handleValueChange = (nextValue: FrequencyValue) => {
    setValue(nextValue)
    if (nextValue === "custom") {
      // Inicializa valores por defecto para modo personalizado
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
      {/* Campo hidden para formularios con el valor RRULE completo */}
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

      {/* Campos adicionales solo para modo "personalizado" */}
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