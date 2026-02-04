'use client'

import { Modal } from "@/src/components/ui/modal"
import { CategoryForm } from "./category-form"
import updateCategory from "@/src/actions/update-category-action"
import { CategoryRow } from "@/src/types/dashboard-types"

// Props
type Props = {
  open: boolean
  category: CategoryRow
  onCancel: () => void
  onAccept: () => void
}

export function EditCategoryModal({ open, category, onCancel, onAccept }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-5xl h-[72vh] rounded-2xl overflow-hidden">
      <CategoryForm
        initialData={{
          name: category.name,
          budget: category.budget.toString(),
          frequency: category.frequency,
          type: category.type,
          dtstart: category.dtstart,
          icon: category.icon,
          color: category.color,
          isActive: category.isActive,
          categoryId: category.categoryId,
        }}
        action={updateCategory}
        onSuccess={onAccept}
        onCancel={onCancel}
      />
    </Modal>
  )
}