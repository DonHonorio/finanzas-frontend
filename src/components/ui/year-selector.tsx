'use client'

import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

type YearSelectorProps = {
  year: number
  setYear: (year: number) => void
  actualYear: number
  setActualYear: (year: number) => void
}

export function YearSelector({ year, setYear, actualYear, setActualYear }: YearSelectorProps) {
  const t = useTranslations("YearSelector")

  return (
    <div className="flex items-center gap-4">
      {/* Botón "Aplicar año" - Solo visible cuando hay cambio sin aplicar -> Sirve para realizar búsqueda en dicho año */}
      {year !== actualYear && ( // year -> año visible / actualYear -> año datos buscados
        <button
          title={t("applyYear")}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          onClick={() => {
            setActualYear(year)
          }}
          disabled={year === actualYear}
        >
          <RotateCw className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}

      {/* Botón año anterior (flecha izquierda)*/}
      <button
        onClick={() => setYear(year - 1)}
        className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Año actual mostrado - tabular-nums para alineación numérica perfecta */}
      <span className="text-2xl font-bold tabular-nums select-none">{year}</span>

      {/* Botón año siguiente (flecha derecha) */}
      <button
        onClick={() => setYear(year + 1)}
        className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
