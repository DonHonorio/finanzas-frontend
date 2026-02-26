import { Modal } from "@/src/components/ui/modal"
import { AccountForm } from "./account-form"
import { createAccount } from "@/src/data-layer/accounts"

type Props = {
  open: boolean
  onCancel: () => void
  onAccept: () => void
}

// Modal de alta que delega toda la lógica de formulario al componente compartido.
export function AddAccountModal({ open, onCancel, onAccept }: Props) {
  return (
    <Modal open={open} onCancel={onCancel} className="w-[92vw] max-w-2xl rounded-2xl overflow-hidden">
      {/* Reusa la misma capa de validación/feedback que el flujo de edición. */}
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
