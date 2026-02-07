import { Modal } from "@/src/components/ui/modal"
import { TransactionForm } from "./transaction-form"
import createTransaction from "@/src/actions/create-transaction-action"
import { Account } from "@/src/types/account-types"
import { Category } from "@/src/types/category-types"

// Props
type Props = {
  open: boolean
  accounts: Account[]
  categories: Category[]
  onCancel: () => void
  onAccept: () => void
};

export function AddTransactionModal({ open, accounts, categories, onAccept, onCancel }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[75vw] max-w-2xl rounded-2xl overflow-hidden">
      <TransactionForm
        accounts={accounts}
        categories={categories}
        action={createTransaction}
        onSuccess={onAccept}
        onCancel={onCancel}
      />
    </Modal>
  );
}