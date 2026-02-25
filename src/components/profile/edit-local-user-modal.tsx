'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { Modal } from '@/src/components/ui/modal'
import { CancelButton } from '@/src/components/ui/cancel-button'
import { SaveButton } from '@/src/components/ui/save-button'
import ErrorMessage from '@/src/components/ui/ErrorMessage'
import { UserSchema } from '@/src/schemas'
import { currencies } from '@/src/types/transaction-types'
import { getUpdateProfileAction, LOCAL_USER_UPDATED_EVENT } from '@/src/data-layer/profile.client'

// Tipo de usuario inferido desde el schema para mantener tipado consistente con el resto de la app.
type User = z.infer<typeof UserSchema>

// Props del modal de configuración local para controlar apertura/cierre y callback de éxito.
interface EditLocalUserModalProps {
    open: boolean
    user: User
    onCancel: () => void
    onSuccess: () => void
}

// Modal para editar únicamente configuración local (moneda y zona horaria) en IndexedDB.
export function EditLocalUserModal({ open, user, onCancel, onSuccess }: EditLocalUserModalProps) {
    // Selecciona la action de actualización local desde el data-layer para no acoplar UI a almacenamiento.
    const updateAction = getUpdateProfileAction("local")

    const [updateState, updateDispatch, isUpdating] = useActionState(updateAction, {
        errors: [],
        success: "",
    })

    // Estado controlado de los dos campos editables del perfil local.
    const [baseCurrency, setBaseCurrency] = useState(user.baseCurrency)
    const [timeZone, setTimeZone] = useState(user.timeZone)

    // Ref para detectar transición real de "enviando" a "terminado" y evitar toasts duplicados.
    const wasUpdatingRef = useRef(false)

    // Sincroniza el formulario con el usuario recibido cuando se abre el modal o cambia su configuración.
    useEffect(() => {
        if (!open) return
        setBaseCurrency(user.baseCurrency)
        setTimeZone(user.timeZone)
    }, [open, user.baseCurrency, user.timeZone])

    // Gestiona side-effects post-submit: éxito (toast + evento + callback) o lista de errores.
    useEffect(() => {
        if (isUpdating) {
            wasUpdatingRef.current = true
            return
        }

        if (!wasUpdatingRef.current) return
        wasUpdatingRef.current = false

        if (updateState.success) {
            toast.success(updateState.success)
            window.dispatchEvent(new Event(LOCAL_USER_UPDATED_EVENT))
            onSuccess()
            return
        }

        if (updateState.errors.length > 0) {
            updateState.errors.forEach((error) => toast.error(error))
        }
    }, [isUpdating, updateState.success, updateState.errors, onSuccess])

    // Lista de zonas horarias soportadas por el runtime para poblar el selector.
    const timeZones = Intl.supportedValuesOf('timeZone')

    return (
        // Contenedor modal con formulario controlado que envía al dispatcher de la action local.
        <Modal open={open} onCancel={onCancel} className="w-[90vw] max-w-2xl rounded-2xl overflow-hidden">
            <form
                className="flex-1 p-6 overflow-y-auto max-h-[80vh]"
                action={updateDispatch}
            >
                {/* Bloque de errores del submit para mostrar múltiples validaciones sin perder contexto. */}
                {updateState.errors.length > 0 && (
                    <div className="mb-4">
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                            {updateState.errors.map((error, index) => (
                                <ErrorMessage key={`${error}-${index}`}>{error}</ErrorMessage>
                            ))}
                        </div>
                    </div>
                )}

                {/* Título principal del modal de configuración local. */}
                <h2 className="text-[26px] font-semibold mb-6">Configuración Local</h2>

                {/* Campos editables del formulario (solo preferencias locales). */}
                <div className="flex flex-col gap-4">
                    {/* Campo Moneda Base: selector controlado y requerido para la preferencia contable principal. */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                            Moneda Base
                        </label>
                        <select
                            name="baseCurrency"
                            value={baseCurrency}
                            onChange={(e) => setBaseCurrency(e.target.value as User["baseCurrency"])}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                            required
                        >
                            {currencies.map((curr) => (
                                <option key={curr.currency} value={curr.currency}>
                                    {curr.currency} - {curr.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo Zona Horaria: selector controlado y requerido para normalizar fechas en vistas y cálculos. */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                            Zona Horaria
                        </label>
                        <select
                            name="timeZone"
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                            required
                        >
                            {timeZones.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer de acciones: cancelar sin cambios o guardar con estado pendiente. */}
                <div className="mt-6 pt-4 flex justify-end gap-4 border-t border-gray-200">
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                        isPending={isUpdating}
                        isValid={true}
                        label="Guardar"
                    />
                </div>
            </form>
        </Modal>
    )
}
