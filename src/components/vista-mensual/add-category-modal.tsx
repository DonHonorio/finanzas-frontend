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
    <Modal open={open} onCancel={onCancel} className="w-[95vw] sm:w-[80vw] max-w-5xl h-[92dvh] sm:h-auto max-h-[92dvh] rounded-2xl overflow-hidden flex flex-col">
      <CategoryForm
        action={createCategory}
        onSuccess={onAccept}
        onCancel={onCancel}
        mode={mode}
      />
    </Modal>
  )
}
