'use client'

import { Modal } from "@/src/components/ui/modal"
import { CategoryRow } from "@/src/types/dashboard-types"

type Props = {
    open: boolean
    category: CategoryRow
    onCancel: () => void
    onAccept: () => void
}

export function EditCategoryModal({ open, category, onCancel, onAccept }: Props) {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            className="w-[70vw] max-w-5xl h-[60vh]"
        >
            {/* CONTENIDO */}
            <div className="flex-1 p-8 space-y-4">
                <h2 className="text-2xl font-semibold">
                    Editar categoría
                </h2>

                <div className="text-gray-600">
                    Aquí irá el formulario para <strong>{category.name}</strong>
                </div>
            </div>

            {/* FOOTER */}
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
                    Guardar
                </button>
            </div>
        </Modal>
    )
}
