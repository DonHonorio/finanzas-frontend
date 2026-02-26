'use client'

import { Modal } from "@/src/components/ui/modal"
import { AccountForm } from "./account-form"
import { updateAccount } from "@/src/data-layer/accounts"
import { Account } from "@/src/types/account-types"
import { useTranslations } from "next-intl"

type Props = {
  open: boolean
  account: Account
  onCancel: () => void
  onAccept: () => void
}

// Modal de edición: hidrata el formulario con datos actuales de la cuenta seleccionada.
export function EditAccountModal({ open, account, onCancel, onAccept }: Props) {
  const t = useTranslations("AccountForm")

  return (
    <Modal open={open} onCancel={onCancel} className="w-[92vw] max-w-2xl rounded-2xl overflow-hidden">
      {/* Reutiliza el mismo formulario para evitar divergencia entre create y update. */}
      <AccountForm
        initialData={account}
        action={updateAccount}
        onSuccess={onAccept}
        onCancel={onCancel}
        title={t("editTitle")}
        submitLabel={t("editSubmit")}
      />
    </Modal>
  )
}
