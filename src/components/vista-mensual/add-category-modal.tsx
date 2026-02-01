'use client'

import { Modal } from "@/src/components/ui/modal"

type Props = {
  open: boolean
  onAccept: () => void
  onCancel: () => void
}

export function AddCategoryModal({ open, onAccept, onCancel }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      // Ancho responsivo: 70% del viewport en desktop, máximo 5xl (1024px)
      // Alto fijo: 60% del viewport, mantiene proporción en diferentes pantallas
      className="w-[70vw] max-w-5xl h-[60vh]"
    >
      {/* CONTENIDO PRINCIPAL DEL MODAL - Área expandible */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Añadir categoría
        </h2>

        <div className="text-gray-500">
          {/* TODO: Implementar formulario para crear nueva categoría */}
          Contenido del modal
        </div>
      </div>

      {/* BARRA DE ACCIONES - Siempre visible en la parte inferior */}
      <div className="border-t px-6 py-4 flex justify-end gap-4">
        {/* Botón secundario - acción de cancelar/cerrar */}
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>

        {/* Botón primario - acción principal de aceptar/guardar */}
        <button
          onClick={onAccept}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Aceptar
        </button>
      </div>
    </Modal>
  )
}