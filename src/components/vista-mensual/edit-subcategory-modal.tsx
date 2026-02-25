'use client'

import { Modal } from "@/src/components/ui/modal"
import { SubcategoryForm } from "./subcategory-form"
import { updateSubcategory } from "@/src/data-layer/subcategories"
import { Subcategory } from "@/src/types/category-types"

type Props = {
  open: boolean
  subcategory: Subcategory      // Subcategoría existente a editar
  onCancel: () => void
  onAccept: () => void
}

// Modal wrapper para editar una subcategoría existente
export function EditSubcategoryModal({ open, subcategory, onCancel, onAccept }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-2xl rounded-2xl overflow-hidden">
      <SubcategoryForm
        initialData={{
          name: subcategory.name,
          description: subcategory.description,
          budget: subcategory.budget,
          color: subcategory.color,
          isActive: subcategory.isActive,
          subcategoryId: subcategory.subcategoryId.toString(), // ID necesario para PUT
        }}
        categoryId={subcategory.categoryId} // ID de la categoría padre (endpoint anidado)
        action={updateSubcategory}          // Server action para actualizar (no crear)
        onSuccess={onAccept}
        onCancel={onCancel}
      />
    </Modal>
  )
}