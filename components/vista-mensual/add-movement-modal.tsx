'use client'

type Props = {
  open: boolean
  onAccept: () => void
  onCancel: () => void
}

export function AddMovementModal({ open, onAccept, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* MODAL */}
      <div
        className="
          relative bg-white rounded-xl shadow-xl
          w-[70vw] max-w-6xl h-[60vh]
          flex flex-col
          animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* CONTENIDO */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Agregar gasto
          </h2>

          <div className="text-gray-500">
            {/* Aquí irá luego el formulario real */}
            Formulario de gasto
          </div>
        </div>

        {/* FOOTER BOTONES */}
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
      </div>
    </div>
  )
}
