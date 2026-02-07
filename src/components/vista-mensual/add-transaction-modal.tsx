import { Modal } from "@/src/components/ui/modal"
import { TransactionForm } from "./transaction-form"
import createTransaction from "@/src/actions/create-transaction-action"
import { Account } from "@/src/types/account-types"
import { Category } from "@/src/types/category-types"

type Props = {
  open: boolean
  accounts: Account[]           // Lista de cuentas para seleccionar
  categories: Category[]        // Lista de categorías para seleccionar
  onCancel: () => void
  onAccept: () => void
  mode: "expenses" | "incomes"  // Para que el formulario empiece por defecto con el tipo correcto seleccionado (gasto o ingreso)
}

// Modal wrapper que contiene el formulario de transacción para añadir un nuevo movimiento
export function AddTransactionModal({ open, accounts, categories, onAccept, onCancel, mode }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-2xl rounded-2xl overflow-hidden">
      <TransactionForm
        accounts={accounts}
        categories={categories}
        action={createTransaction}  // Server action que maneja el submit
        onSuccess={onAccept}        // Se ejecuta tras crear la transacción exitosamente
        onCancel={onCancel}
        mode={mode}
      />
    </Modal>
  );
}