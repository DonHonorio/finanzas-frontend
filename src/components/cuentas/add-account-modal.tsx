import { Modal } from "@/src/components/ui/modal"
import { AccountForm } from "./account-form"
import { createAccount } from "@/src/data-layer/accounts"

type Props = {
  open: boolean
  onCancel: () => void
  onAccept: () => void
}

export function AddAccountModal({ open, onCancel, onAccept }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[92vw] max-w-2xl rounded-2xl overflow-hidden">
      <AccountForm
        action={createAccount}
        onSuccess={onAccept}
        onCancel={onCancel}
        title="Crear Cuenta"
        submitLabel="Crear"
      />
    </Modal>
  )
}
