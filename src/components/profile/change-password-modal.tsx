'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from "@/src/components/ui/modal"
import updatePassword from '@/src/actions/update-password-action'
import { toast } from "react-toastify"
import { CancelButton } from "@/src/components/ui/cancel-button"
import { SaveButton } from "@/src/components/ui/save-button"
import ErrorMessage from "@/src/components/ui/ErrorMessage"
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ChangePasswordModalProps {
    open: boolean
    onCancel: () => void
    onSuccess: () => void
}

/**
 * Modal para cambiar la contraseña del usuario.
 * 
 * Funcionalidades:
 * - Validación de contraseña actual
 * - Entrada de nueva contraseña con confirmación
 * - Mostrar/ocultar contraseñas
 * - Validación y manejo de errores
 * - Notificaciones toast de éxito/error
 */
export function ChangePasswordModal({ open, onCancel, onSuccess }: ChangePasswordModalProps) {
    const t = useTranslations("ChangePasswordModal")
    // Estado para la acción de actualización de contraseña
    const [state, dispatch, isPending] = useActionState(updatePassword, {
        errors: [],
        success: "",
    })

    // Estados del formulario
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Estados para mostrar/ocultar contraseñas
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Error de confirmación de contraseña
    const [confirmError, setConfirmError] = useState('')

    // Mostrar toast notifications según resultado
    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            // Limpiar campos y cerrar modal
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            onSuccess()
        }
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    // Validar que las contraseñas coincidan
    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value)
        if (value && value !== newPassword) {
            setConfirmError(t('mismatch'))
        } else {
            setConfirmError('')
        }
    }

    // Validar que las contraseñas coincidan al cambiar la nueva contraseña
    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value)
        if (confirmPassword && confirmPassword !== value) {
            setConfirmError(t('mismatch'))
        } else {
            setConfirmError('')
        }
    }

    // Validar formulario
    const isValid = currentPassword.length > 0 && 
                    newPassword.length >= 6 && 
                    confirmPassword === newPassword &&
                    currentPassword !== newPassword

    return (
        <Modal open={open} onCancel={onCancel} className="w-[90vw] max-w-md rounded-2xl overflow-hidden">
            <form
                className="flex-1 p-6"
                action={dispatch}
            >
                {/* Mensajes de error */}
                {state.errors.length > 0 && (
                    <div className="mb-4">
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                            {state.errors.map((error, index) => (
                                <ErrorMessage key={`${error}-${index}`}>{error}</ErrorMessage>
                            ))}
                        </div>
                    </div>
                )}

                {/* Título */}
                <h2 className="text-[26px] font-semibold mb-6">{t("title")}</h2>

                <div className="flex flex-col gap-4">
                    {/* Input contraseña actual */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                            {t("currentPassword")}
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                name="currentPassword"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-[15px] focus:outline-none focus:border-primary"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Input nueva contraseña */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                            {t("newPassword")}
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => handleNewPasswordChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-[15px] focus:outline-none focus:border-primary"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {t("minLength")}
                        </p>
                    </div>

                    {/* Input confirmar nueva contraseña */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                            {t("confirmPassword")}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-[15px] focus:outline-none focus:border-primary"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {confirmError && (
                            <p className="text-xs text-red-500 mt-1">{confirmError}</p>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 pt-4 flex justify-end gap-4 border-t border-gray-200">
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                        isPending={isPending}
                        isValid={isValid}
                        label={t("update")}
                    />
                </div>
            </form>
        </Modal>
    )
}
