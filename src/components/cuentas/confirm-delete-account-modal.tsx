'use client'

import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"
import { useTranslations } from "next-intl"

type Props = {
  isOpen: boolean
  accountName: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

// Wrapper semántico del modal destructivo para mantener copy y validación centralizadas en cuentas.
export function ConfirmDeleteAccountModal({ isOpen, accountName, isDeleting, onClose, onConfirm }: Props) {
  const t = useTranslations("AccountForm")
  const tCommon = useTranslations("CommonButtons")

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title={t("deleteTitle")}
      // Obliga a escribir el nombre para prevenir eliminaciones accidentales.
      description={
        <p>
          {t("deleteDescription", { name: accountName })}
        </p>
      }
      validationText={accountName}
      inputPlaceholder={t("deletePlaceholder")}
      confirmButtonText={tCommon("delete")}
    />
  )
}
