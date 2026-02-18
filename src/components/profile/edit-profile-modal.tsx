'use client'

import { useState, useActionState, useEffect, startTransition } from 'react'
import { Modal } from "@/src/components/ui/modal"
import { z } from 'zod'
import { UserSchema } from '@/src/schemas'
import updateUser from '@/src/actions/update-user-action'
import deleteUser from '@/src/actions/delete-user-action'
import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"
import { ChangePasswordModal } from "@/src/components/profile/change-password-modal"
import { ProfileFormFields } from "@/src/components/profile/profile-form-fields"
import { toast } from "react-toastify"
import { CancelButton } from "@/src/components/ui/cancel-button"
import { SaveButton } from "@/src/components/ui/save-button"
import { DeleteButton } from "@/src/components/ui/delete-button"
import ErrorMessage from "@/src/components/ui/ErrorMessage"
import { Key } from 'lucide-react'

type User = z.infer<typeof UserSchema>

interface EditProfileModalProps {
    open: boolean
    user: User
    onCancel: () => void
    onSuccess: () => void
}

/**
 * Modal principal para editar el perfil del usuario.
 * 
 * Funcionalidades:
 * - Edición de datos del perfil (nombre, email, moneda, etc.)
 * - Eliminación de cuenta con confirmación
 * - Validación y manejo de errores
 * - Notificaciones toast de éxito/error
 * 
 * Los campos del formulario están en ProfileFormFields para mantener este componente limpio.
 */
export function EditProfileModal({ open, user, onCancel, onSuccess }: EditProfileModalProps) {
    // Estado para la acción de actualización
    const [updateState, updateDispatch, isUpdating] = useActionState(updateUser, {
        errors: [],
        success: "",
    })

    // Estado para la acción de eliminación
    const [deleteState, deleteDispatch, isDeleting] = useActionState(deleteUser, {
        errors: [],
        success: "",
    })

    // Estados del formulario
    const [name, setName] = useState(user.name)
    const [fullName, setFullName] = useState(user.fullName)
    const [email, setEmail] = useState(user.email)
    const [baseCurrency, setBaseCurrency] = useState(user.baseCurrency)
    const [timeZone, setTimeZone] = useState(user.timeZone)
    const [avatar, setAvatar] = useState(user.avatar || '')

    // Estado para modal de confirmación de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Estado para modal de cambiar contraseña
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

    // Mostrar toast notifications según resultado de actualización
    useEffect(() => {
        if (updateState.success) {
            toast.success(updateState.success)
            onSuccess()
        }
        if (updateState.errors.length > 0) {
            updateState.errors.forEach((error) => toast.error(error))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateState])

    // Mostrar toast notifications según resultado de eliminación
    useEffect(() => {
        // Solo mostrar errores, el success redirige desde el servidor
        if (deleteState.errors.length > 0) {
            deleteState.errors.forEach((error) => toast.error(error))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteState])

    // Maneja el envío de la acción de eliminación
    const handleDelete = () => {
        startTransition(() => {
            const formData = new FormData()
            deleteDispatch(formData)
        })
    }

    return (
        <>
            <Modal open={open} onCancel={onCancel} className="w-[90vw] max-w-2xl rounded-2xl overflow-hidden">
                <form
                    className="flex-1 p-6 overflow-y-auto max-h-[80vh]"
                    action={updateDispatch}
                >
                    {/* Mensajes de error */}
                    {updateState.errors.length > 0 && (
                        <div className="mb-4">
                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                {updateState.errors.map((error, index) => (
                                    <ErrorMessage key={`${error}-${index}`}>{error}</ErrorMessage>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Título */}
                    <h2 className="text-[26px] font-semibold mb-6">Editar Perfil</h2>

                    {/* Campos del formulario de perfil */}
                    <ProfileFormFields
                        name={name}
                        setName={setName}
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        baseCurrency={baseCurrency}
                        setBaseCurrency={setBaseCurrency}
                        timeZone={timeZone}
                        setTimeZone={setTimeZone}
                        avatar={avatar}
                        setAvatar={setAvatar}
                    />

                    {/* Botón para cambiar contraseña */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setIsChangePasswordModalOpen(true)}
                            className="flex items-center gap-2 p-2 border rounded-lg bg-primary/80 text-primary-foreground hover:bg-primary/90 font-medium text-[15px] transition-colors"
                        >
                            <Key size={18} />
                            <span>Cambiar Contraseña</span>
                        </button>
                    </div>

                    {/* Botón para abrir modal de eliminación */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <DeleteButton
                            onClick={() => setIsDeleteModalOpen(true)}
                            label="Eliminar Cuenta"
                            className="w-full sm:w-1/2"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Esta acción es permanente y eliminará todos tus datos.
                        </p>
                    </div>

                    {/* Botones de acción del formulario */}
                    <div className="mt-6 pt-4 flex justify-end gap-4 border-t border-gray-200">
                        <CancelButton onClick={onCancel} />
                        <SaveButton
                            isPending={isUpdating}
                            isValid={true}
                            label="Guardar Cambios"
                        />
                    </div>
                </form>
            </Modal>

            {/* Modal de confirmación para eliminación de cuenta */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Confirmar Eliminación de Cuenta"
                description={
                    <div>
                        <p className="mb-2">
                            ⚠️ <strong>Esta acción es irreversible.</strong>
                        </p>
                        <p className="mb-2">
                            Se eliminarán permanentemente:
                        </p>
                        <ul className="list-disc list-inside mb-2 text-sm">
                            <li>Tu perfil de usuario</li>
                            <li>Todas tus cuentas</li>
                            <li>Todas tus categorías</li>
                            <li>Todas tus transacciones</li>
                        </ul>
                        <p>
                            Escribe <strong>{user.email}</strong> para confirmar.
                        </p>
                    </div>
                }
                validationText={user.email}
                inputPlaceholder="Escribe tu email"
                confirmButtonText="Eliminar Cuenta"
            />

            {/* Modal para cambiar contraseña */}
            <ChangePasswordModal
                open={isChangePasswordModalOpen}
                onCancel={() => setIsChangePasswordModalOpen(false)}
                onSuccess={() => setIsChangePasswordModalOpen(false)}
            />
        </>
    )
}
