'use client'

import { Modal } from "@/src/components/ui/modal"
import { SubcategoryForm } from "./subcategory-form"
import { createSubcategory } from "@/src/data-layer/subcategories"

type Props = {
  open: boolean
  categoryId: number        // ID de la categoría padre a la que pertenecerá la subcategoría
  onCancel: () => void
  onAccept: () => void
}

// Modal wrapper para crear una nueva subcategoría dentro de una categoría existente
export function AddSubcategoryModal({ open, categoryId, onCancel, onAccept }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-2xl rounded-2xl overflow-hidden">
      <SubcategoryForm
        categoryId={categoryId}     // Pasa el ID al formulario para la relación jerárquica
        action={createSubcategory} // Server action para crear subcategoría
        onSuccess={onAccept}       // Callback al crear exitosamente
        onCancel={onCancel}
      />
    </Modal>
  )
}