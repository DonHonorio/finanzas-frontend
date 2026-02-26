'use client'

import { useState } from 'react'
import { deleteTransaction } from '@/src/data-layer/transactions'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

/**
 * Hook para manejar la eliminación de transacciones
 * Encapsula la lógica de estado y la acción de eliminar
 */
export function useDeleteTransaction() {
    const t = useTranslations("CategoryModal")
    // ID de la transacción que está actualmente seleccionada para eliminar
    // null = ninguna transacción en proceso de eliminación
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Estado de carga para deshabilitar botones durante la petición
    const [isDeleting, setIsDeleting] = useState(false)

    // Elimina una transacción y ejecuta callbacks de éxito
    const handleDelete = async (
        transactionId: string | null,
        categoryId: number,
        onSuccess?: () => void
    ) => {
        if (!transactionId) return

        setIsDeleting(true)
        try {
            // Prepara FormData para el server action
            const formData = new FormData()
            formData.append('transactionId', transactionId)
            formData.append('categoryId', categoryId.toString())

            // Llama al server action
            const result = await deleteTransaction({ errors: [], success: '' }, formData)

            if (result?.errors && result.errors.length > 0) {
                // Error controlado de la API
                toast.error(result.errors[0])
            } else {
                // Éxito: notifica, limpia estado y refresca datos
                toast.success(t("transactionDeleted"))
                setDeletingId(null)
                onSuccess?.()
            }
        } catch (error) {
            // Error inesperado (red, servidor caído, etc)
            console.error('Error deleting transaction:', error)
            toast.error(t("transactionDeleteError"))
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        deletingId,      // ID de la transacción pendiente de eliminar
        isDeleting,      // Booleano para UI (deshabilitar botones, mostrar spinner)
        setDeletingId,   // Setter para seleccionar qué transacción eliminar
        handleDelete     // Función que ejecuta la eliminación
    }
}
