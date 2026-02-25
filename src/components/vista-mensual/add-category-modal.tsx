import { Modal } from "@/src/components/ui/modal"
import { CategoryForm } from "./category-form"
import { createCategory } from "@/src/data-layer/categories"

// Props
type Props = {
  open: boolean
  onCancel: () => void
  onAccept: () => void
  mode: "expenses" | "incomes"
}
// Modal para agregar una nueva categoría, usado en la vista mensual
export function AddCategoryModal({ open, onAccept, onCancel, mode }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-5xl rounded-2xl overflow-hidden">
      <CategoryForm
        action={createCategory}
        onSuccess={onAccept}
        onCancel={onCancel}
        mode={mode}
      />
    </Modal>
  )
}