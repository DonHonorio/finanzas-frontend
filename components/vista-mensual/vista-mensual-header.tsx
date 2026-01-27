'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type Mode = 'gastos' | 'ingresos'

export function VistaMensualHeader() {
  const [mode, setMode] = useState<Mode>('gastos')
  const [year, setYear] = useState(2026)

  const onBack = () => {
    // hook vacío – aquí meterás router.back() o lo que quieras
  }

  return (
    <div className="mb-6">

      <div className="flex items-center gap-x-4 mb-6">
        {/* VOLVER */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border-border rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-accent active:-translate-x-0.5 transition select-none"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </button>

        {/* TÍTULO */}
        <h1 className="mx-auto text-3xl font-bold">
          Vista Mensual
        </h1>

      </div>

      {/* CONTROLES */}
      <div className="flex items-center justify-between">

        {/* SWITCH */}
        <div className="relative bg-gray-100 rounded-xl p-1 w-56 h-12 flex items-center">

          {/* SLIDER */}
          <div
            className={`
              absolute top-1 left-1 h-10 w-[calc(50%-4px)]
              bg-primary text-primary-foreground rounded-lg shadow
              transition-all duration-300
              ${mode === 'ingresos' ? 'translate-x-full' : ''}
            `}
          />

          <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition select-none
              ${mode === 'gastos' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
            onClick={() => setMode('gastos')}
          >
            Gastos
          </button>

          <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition select-none
              ${mode === 'ingresos' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
            onClick={() => setMode('ingresos')}
          >
            Ingresos
          </button>
        </div>

        {/* SELECTOR DE AÑO */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => setYear(y => y - 1)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-2xl font-bold tabular-nums select-none">
            {year}
          </span>

          <button
            onClick={() => setYear(y => y + 1)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>
      </div>
    </div>
  )
}
