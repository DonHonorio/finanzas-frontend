'use client'

import { useState } from 'react'
import { ToggleButton } from '../ui/toggle-button'
import { YearSelector } from '../ui/year-selector'
import { BackButton } from '../ui/back-button'
import { useTranslations } from 'next-intl'

type Props = {
  mode: "expenses" | "incomes"
  setMode: (m: "expenses" | "incomes") => void
  actualYear: number
  setActualYear: (y: number) => void
}

/**
 * Componente de cabecera para la Vista Mensual
 * Contiene controles de navegación: botón volver, selector modo (gastos/ingresos) y selector de año
 */
export function VistaMensualHeader({ mode, setMode, actualYear, setActualYear }: Props) {
  const t = useTranslations("MonthlyView")
  // Estado local para el año mostrado en el selector (puede diferir del año aplicado)
  const [year, setYear] = useState(actualYear)

  return (
    <div className="mb-6">

      {/* 1. Fila superior: Título */}
      <div className="flex items-center justify-center mb-6">
        {/* Título principal */}
        <h1 className="text-3xl font-bold">
          {t("title")}
        </h1>

      </div>

      {/* 2. Fila inferior: Controles principales (modo y año) */}
      <div className="flex items-center justify-between">

        {/* Selector de modo: Gastos vs Ingresos */}
        <div className="relative bg-gray-100 rounded-xl p-1 w-40 sm:w-56 h-10 sm:h-12 flex items-center">

          {/* Indicador visual deslizante - cambia posición según el modo */}
          <div
            className={`
              absolute top-1 left-1 h-8 sm:h-10 w-[calc(50%-4px)]
              bg-primary text-primary-foreground rounded-lg shadow
              transition-all duration-300
              ${mode === 'incomes' ? 'translate-x-full' : ''} /* Desplaza a derecha para ingresos */
            `}
          />

          {/* Botón "Gastos" */}
          <ToggleButton
            isActive={mode === 'expenses'}
            label={t("expenses")}
            onClick={() => setMode('expenses')}
          />

          {/* Botón "Ingresos" */}
          <ToggleButton
            isActive={mode === 'incomes'}
            label={t("incomes")}
            onClick={() => setMode('incomes')}
          />
        </div>

        {/* Selector de año con navegación y botón de aplicar cambios */}
        <YearSelector
          year={year}
          setYear={setYear}
          actualYear={actualYear}
          setActualYear={setActualYear}
        />
      </div>
    </div>
  )
}
