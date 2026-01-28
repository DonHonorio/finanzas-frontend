'use client'

import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { useState } from 'react'

type Mode = 'expenses' | 'incomes'

export function VistaMensualHeader() {
  const [mode, setMode] = useState<Mode>('expenses')
  const [actualYear, setActualYear] = useState(new Date().getFullYear())
  const [year, setYear] = useState(new Date().getFullYear())

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
              ${mode === 'incomes' ? 'translate-x-full' : ''}
            `}
          />

          <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition select-none
              ${mode === 'expenses' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
            onClick={() => setMode('expenses')}
          >
            Gastos
          </button>

          <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition select-none
              ${mode === 'incomes' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
            onClick={() => setMode('incomes')}
          >
            Ingresos
          </button>
        </div>

        {/* SELECTOR DE AÑO */}
        <div className="flex items-center gap-4">

          {year !== actualYear && (
            <button className='p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground'
              onClick={() => { setActualYear(year); alert('Pulsado') }}
              disabled={year === actualYear}
            >
              <RotateCw className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}


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
