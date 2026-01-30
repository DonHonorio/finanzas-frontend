'use client'

import { useState } from 'react'
import { Dashboard } from "@/components/vista-mensual/dashboard"
import { VistaMensualHeader } from "@/components/vista-mensual/vista-mensual-header"
import { AddMovementModal } from "@/components/vista-mensual/add-movement-modal"

export function VistaMensualPageClient() {
  const [openModal, setOpenModal] = useState(false)
  const [mode, setMode] = useState<"expenses" | "incomes">("expenses")
  const [actualYear, setActualYear] = useState(new Date().getFullYear())

  return (
    <div className="h-screen p-10 box-border">
      <div className="h-full flex flex-col">

        {/* HEADER */}
        <VistaMensualHeader mode={mode} setMode={setMode} actualYear={actualYear} setActualYear={setActualYear} />

        {/* CONTENIDO */}
        <main className="flex-1 overflow-hidden">
          <Dashboard mode={mode} actualYear={actualYear} />
        </main>

        {/* BOTÓN */}
        <footer className="h-10 mt-4 flex justify-end shrink-0">
          <button
            onClick={() => setOpenModal(true)}
            className="w-60 bg-primary hover:bg-primary/90 text-primary-foreground text-lg rounded-lg transition select-none"
          >
            + Añadir Movimiento
          </button>
        </footer>
      </div>

      {/* MODAL */}
      <AddMovementModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onAccept={() => {
          setOpenModal(false)
          // lógica real más adelante
        }}
      />
    </div>
  )
}
