import { Modal } from "@/src/components/ui/modal"
import { TransactionForm } from "./transaction-form"
import { updateTransaction } from "@/src/data-layer/transactions"
import { Transaction } from "@/src/types/transaction-types"
import { Account } from "@/src/types/account-types"
import { Category, Subcategory } from "@/src/types/category-types"

type Props = {
    open: boolean
    transaction: Transaction          // Datos de la transacción a editar
    accounts: Account[]
    categories: Category[]
    onCancel: () => void
    onAccept: () => void
    mode: "expenses" | "incomes"      // Determina el tipo inicial del formulario
    subcategories?: Subcategory[]     // Subcategorías precargadas (opcional)
}

// Modal wrapper para editar transacción existente
export function EditTransactionModal({ open, transaction, accounts, categories, onCancel, onAccept, mode, subcategories }: Props) {
    return (
        <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-2xl rounded-2xl overflow-hidden">
            <TransactionForm
            // Se pasan los datos de la transacción a editar como initialData para prellenar el formulario
                initialData={{
                    transactionId: transaction.transactionId,
                    name: transaction.name,
                    date: transaction.date,
                    amount: transaction.amount,
                    description: transaction.description,
                    type: transaction.type,
                    currency: transaction.currency,
                    updatedAt: transaction.updatedAt,
                    accountId: transaction.accountId,
                    categoryId: transaction.categoryId,
                    subcategoryId: transaction.subcategoryId
                }}
                accounts={accounts}
                categories={categories}
                action={updateTransaction}  // Server action para actualizar (no crear)
                onSuccess={onAccept}
                onCancel={onCancel}
                mode={mode}
                subcategories={subcategories}
            />
        </Modal>
    )
}