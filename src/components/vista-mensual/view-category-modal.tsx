'use client'

import { Modal } from "@/src/components/ui/modal"
import { CategoryRow } from "@/src/types/dashboard-types"

type Props = {
    open: boolean
    category: CategoryRow
    onCancel: () => void
}

export function ViewCategoryModal({ open, category, onCancel }: Props) {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            className="w-[70vw] max-w-5xl h-[60vh]"
        >
            {/* CONTENIDO */}
            <div className="flex-1 p-8 space-y-4 text-sm">
                <h2 className="text-2xl font-semibold">
                    Detalle de categoría
                </h2>

                <ul className="space-y-2 text-gray-700">
                    <li><strong>Nombre:</strong> {category.name}</li>
                    <li><strong>Presupuesto:</strong> {category.budget}€</li>
                    <li className="flex items-center gap-2">
                        <strong>Color:</strong>
                        <span
                            className="inline-block w-4 h-4 rounded-full border"
                        />
                    </li>
                    <li>
                        <strong>Activo:</strong>
                    </li>
                </ul>
            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-4 flex justify-end">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    )
}
