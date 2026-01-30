'use client'

import { Modal } from "@/components/ui/modal"

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
      className="w-[70vw] max-w-5xl h-[60vh]"
    >
      {/* CONTENIDO */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Añadir categoría
        </h2>

        <div className="text-gray-500">
          {/* Aquí meterás luego el formulario */}
          Contenido del modal
        </div>
      </div>

      {/* BOTONES */}
      <div className="border-t px-6 py-4 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>

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
