'use client'

import { useState } from 'react'
import { Dashboard } from "@/components/vista-mensual/dashboard"
import { VistaMensualHeader } from "@/components/vista-mensual/vista-mensual-header"
import { AddMovementModal } from "@/components/vista-mensual/add-movement-modal"

export function VistaMensualPageClient() {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="h-screen p-10 box-border">
      <div className="h-full flex flex-col">

        {/* HEADER */}
        <VistaMensualHeader />

        {/* CONTENIDO */}
        <main className="flex-1 overflow-hidden">
          <Dashboard />
        </main>

        {/* BOTÓN */}
        <footer className="h-10 mt-4 flex justify-end shrink-0">
          <button
            onClick={() => setOpenModal(true)}
            className="w-80 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition"
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
