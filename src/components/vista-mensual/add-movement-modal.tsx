import { Modal } from "@/components/ui/modal"

export function AddMovementModal({ open, onAccept, onCancel }: {
  open: boolean
  onAccept: () => void
  onCancel: () => void
}) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[70vw] max-w-5xl h-[60vh]">
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">Agregar gasto</h2>
        <div className="text-gray-500">Formulario de gasto</div>
      </div>

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
