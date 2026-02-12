import { Modal } from "./modal"
import { CancelButton } from "./cancel-button"

type DeleteTransactionModalProps = {
    isOpen: boolean
    isDeleting: boolean      // Estado de la acción de eliminación en progreso
    onCancel: () => void
    onConfirm: () => void
}

// Modal de confirmación específico para eliminación de transacciones
// Versión simplificada sin verificación por texto (a diferencia de DeleteConfirmationModal)
export function DeleteTransactionModal({
    isOpen,
    isDeleting,
    onCancel,
    onConfirm
}: DeleteTransactionModalProps) {
    return (
        <Modal open={isOpen} onCancel={onCancel} className="w-96 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6 text-center">
                ¿Estás seguro de que deseas eliminar este movimiento?
                <br />
                <span className="text-sm text-gray-500">Esta acción no se puede deshacer.</span>
            </p>
            <div className="flex justify-center gap-3">
                {/* Botón cancelar */}
                <CancelButton onClick={onCancel} className="px-4 py-2 font-medium" />
                {/* Botón confirmar eliminación */}
                <button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium flex items-center gap-2 hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
            </div>
        </Modal>
    )
}