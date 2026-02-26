"use client"

import { useState } from "react"
import { Modal } from "./modal"
import { cn } from "@/src/lib/utils"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean                // Estado de la acción de eliminación en progreso
    title?: string
    description: React.ReactNode       // Descripción con el texto que debe coincidir
    validationText: string             // Texto exacto que usuario debe escribir para confirmar
    inputPlaceholder?: string
    confirmButtonText?: string
    cancelButtonText?: string
}

// Modal de confirmación para acciones destructivas que requiere escritura manual
export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    title,
    description,
    validationText,
    inputPlaceholder,
    confirmButtonText,
    cancelButtonText
}: DeleteConfirmationModalProps) {
    const t = useTranslations()
    const [inputValue, setInputValue] = useState("")

    // Valida que el texto ingresado coincida exactamente antes de ejecutar onConfirm
    const handleConfirm = () => {
        if (inputValue.trim() !== validationText.trim()) {
            toast.error(t("DeleteConfirmationModal.mismatch"))
            return
        }
        onConfirm()
    }

    // Maneja el cierre del modal y resetea el input
    const handleClose = () => {
        setInputValue("")
        onClose()
    }

    return (
        <Modal
            open={isOpen}
            onCancel={handleClose}
            className="w-[90vw] max-w-lg rounded-2xl p-6"
        >
            {/* título */}
            <h2 className="text-xl font-semibold mb-4">{title ?? t("DeleteConfirmationModal.defaultTitle")}</h2>
            {/* descripción */}
            <div className="text-gray-700 mb-4">
                {description}
            </div>
            {/* input para validación */}
            <input
                type="text"
                placeholder={inputPlaceholder ?? t("DeleteConfirmationModal.defaultPlaceholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
            />
            {/* botones de cancelar y confirmar */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    {cancelButtonText ?? t("CommonButtons.cancel")}
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-white select-none",
                        isDeleting ? "bg-destructive cursor-not-allowed" : "bg-destructive hover:bg-destructive/90"
                    )}
                >
                    {isDeleting ? t("DeleteConfirmationModal.deleting") : (confirmButtonText ?? t("CommonButtons.delete"))}
                </button>
            </div>
        </Modal>
    )
}
