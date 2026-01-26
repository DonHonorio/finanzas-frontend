'use client'

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

      {/* VOLVER */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 active:-translate-x-0.5 transition mb-2"
      >
        ← Volver
      </button>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-4 text-center">
        Vista Mensual
      </h1>

      {/* CONTROLES */}
      <div className="flex items-center justify-between">

        {/* SWITCH */}
        <div className="relative bg-gray-100 rounded-xl p-1 w-56 h-12 flex items-center">

          {/* SLIDER */}
          <div
            className={`
              absolute top-1 left-1 h-10 w-[calc(50%-4px)]
              bg-white rounded-lg shadow
              transition-all duration-300
              ${mode === 'ingresos' ? 'translate-x-full' : ''}
            `}
          />

          <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition
              ${mode === 'gastos' ? 'text-gray-900' : 'text-gray-500'}
            `}
            onClick={() => setMode('gastos')}
          >
            Gastos
          </button>

          <button
            className={`relative z-10 w-1/2 text-sm font-semibold transition
              ${mode === 'ingresos' ? 'text-gray-900' : 'text-gray-500'}
            `}
            onClick={() => setMode('ingresos')}
          >
            Ingresos
          </button>
        </div>

        {/* AÑO */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => setYear(y => y - 1)}
            className="text-2xl text-gray-500 hover:text-gray-900 active:scale-90 transition"
          >
            ‹
          </button>

          <span className="text-2xl font-bold tabular-nums">
            {year}
          </span>

          <button
            onClick={() => setYear(y => y + 1)}
            className="text-2xl text-gray-500 hover:text-gray-900 active:scale-90 transition"
          >
            ›
          </button>

        </div>
      </div>
    </div>
  )
}
