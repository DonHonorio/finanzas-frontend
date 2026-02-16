'use client'

import { TrendingUp } from "lucide-react"
import { Logo } from "@/src/components/ui/logo"
import { BackButton } from "@/src/components/ui/back-button"

export default function PatrimonioPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full px-8 py-4 flex items-center justify-between bg-white border-b border-gray-200">
        <Logo />
        
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
          Iniciar Sesión
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-10">
        <div className="h-full flex flex-col">
          {/* Botón Volver */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Área de contenido */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Patrimonio Personal</h1>
            <p className="text-gray-500">Próximamente...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
