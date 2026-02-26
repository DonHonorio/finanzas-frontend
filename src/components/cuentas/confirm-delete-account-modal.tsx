'use client'

import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"

type Props = {
  isOpen: boolean
  accountName: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteAccountModal({ isOpen, accountName, isDeleting, onClose, onConfirm }: Props) {
  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title="Eliminar cuenta"
      description={
        <p>
          Esta acción eliminará la cuenta y no se puede deshacer. Escribe <strong>{accountName}</strong> para
          confirmar.
        </p>
      }
      validationText={accountName}
      inputPlaceholder="Nombre de la cuenta"
      confirmButtonText="Eliminar"
    />
  )
}
