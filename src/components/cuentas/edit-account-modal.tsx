'use client'

import { Modal } from "@/src/components/ui/modal"
import { AccountForm } from "./account-form"
import { updateAccount } from "@/src/data-layer/accounts"
import { Account } from "@/src/types/account-types"

type Props = {
  open: boolean
  account: Account
  onCancel: () => void
  onAccept: () => void
}

export function EditAccountModal({ open, account, onCancel, onAccept }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[92vw] max-w-2xl rounded-2xl overflow-hidden">
      <AccountForm
        initialData={account}
        action={updateAccount}
        onSuccess={onAccept}
        onCancel={onCancel}
        title="Editar Cuenta"
        submitLabel="Guardar"
      />
    </Modal>
  )
}
