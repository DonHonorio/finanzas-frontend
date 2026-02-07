import { Modal } from "@/src/components/ui/modal"
import { TransactionForm } from "./transaction-form"
import updateTransaction from "@/src/actions/update-transaction-action"
import { Transaction } from "@/src/types/transaction-types"
import { Account } from "@/src/types/account-types"
import { Category } from "@/src/types/category-types"

// Props
type Props = {
    open: boolean
    transaction: Transaction
    accounts: Account[]
    categories: Category[]
    onCancel: () => void
    onAccept: () => void
}

export function EditTransactionModal({ open, transaction, accounts, categories, onCancel, onAccept }: Props) {
    return (
        <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-2xl rounded-2xl overflow-hidden">
            <TransactionForm
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
                    categoryId: transaction.categoryId
                }}
                accounts={accounts}
                categories={categories}
                action={updateTransaction}
                onSuccess={onAccept}
                onCancel={onCancel}
            />
        </Modal>
    );
}