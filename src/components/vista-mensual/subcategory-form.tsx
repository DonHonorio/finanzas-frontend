'use client'

import React, { useActionState, useEffect, useState } from "react"
import { cn, colorOptions } from "@/src/lib/utils"
import ErrorMessage from "../ui/ErrorMessage"
import { toast } from "react-toastify"
import { ActiveToggle } from "@/src/components/ui/active-toggle"
import { ActionStateType } from "@/src/types/action-types"
import { DeleteButton } from "@/src/components/ui/delete-button"
import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"
import { CancelButton } from "@/src/components/ui/cancel-button"
import { SaveButton } from '@/src/components/ui/save-button'
import { deleteSubcategory } from "@/src/data-layer/subcategories"
import { useTranslations } from "next-intl"

type Props = {
    initialData?: {
        name: string
        description?: string
        budget: string
        color?: string
        isActive: boolean
        subcategoryId?: string
    }
    categoryId: number
    action: (prevState: ActionStateType, formData: FormData) => Promise<{ errors: string[]; success: string }>
    onSuccess: () => void
    onCancel: () => void
}

export function SubcategoryForm({ initialData, categoryId, action, onSuccess, onCancel }: Props) {
    const t = useTranslations("SubcategoryForm")
    const tCommon = useTranslations("CommonButtons")
    const [state, dispatch, isPending] = useActionState(action, {
        errors: [],
        success: ''
    })

    // Estado del formulario (propiedades de la subcategoría)
    const [name, setName] = useState(initialData?.name || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [budget, setBudget] = useState(initialData?.budget || "")
    const [color, setColor] = useState(initialData?.color || colorOptions[0])
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
    const [subcategoryId] = useState(initialData?.subcategoryId || "")

    // Estado para la acción de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteState, deleteDispatch, isDeleting] = useActionState(deleteSubcategory, {
        errors: [],
        success: "",
    })

    // Validación del formulario (propiedades requeridas y formato)
    const isFormValid =
        name.trim().length > 0 &&
        budget !== ""

    // Manejar el éxito o error del action
    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            onSuccess()
        }
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    // Mostrar toast notifications según resultado de la acción de eliminación
    useEffect(() => {
        if (deleteState.success) {
            toast.success(deleteState.success)
            onSuccess()
        }
        if (deleteState.errors.length > 0) {
            deleteState.errors.forEach((error) => toast.error(error))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteState])

    // Maneja el envío de la acción de eliminación
    const handleDelete = () => {
        if (!initialData?.subcategoryId) return
        const formData = new FormData()
        formData.append("subcategoryId", initialData.subcategoryId)
        formData.append("categoryId", String(categoryId))

        React.startTransition(() => {
            deleteDispatch(formData)
        })
    }

    return (
        <form
            id="subcategory-form"
            className="flex-1 p-6 overflow-hidden"
            action={dispatch}
        >
            {/* Campos ocultos para IDs */}
            <input type="hidden" name="subcategoryId" value={subcategoryId} />
            <input type="hidden" name="categoryId" value={categoryId} />

            {/* Mensajes de error */}
            {state.errors.length > 0 && (
                <div className="px-6 pt-5">
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {state.errors.map((error, index) => (
                            <ErrorMessage key={`${error}-${index}`}>{error}</ErrorMessage>
                        ))}
                    </div>
                </div>
            )}

            {/* Título dinámico */}
            <h2 className="text-[26px] font-semibold mb-4">
                {initialData ? t("editTitle") : t("createTitle")}
            </h2>

            {/* Contenido del formulario */}
            <div className="space-y-4 h-[calc(55vh-260px)]">
                {/* Nombre */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("name")}</label>
                    <input
                        type="text"
                        name="name"
                        placeholder={t("namePlaceholder")}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("descriptionOptional")}</label>
                    <textarea
                        name="description"
                        placeholder={t("descriptionPlaceholder")}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary resize-none"
                        rows={3}
                    />
                </div>

                {/* Presupuesto */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("budget")}</label>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        name="budget"
                        placeholder="0,00"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Color */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-2">{t("color")}</label>
                    <input type="hidden" name="color" value={color} />
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((item, index) => (
                            <button
                                key={`${item}-${index}`}
                                type="button"
                                onClick={() => setColor(item)}
                                className={cn(
                                    "h-9 w-9 rounded-lg border transition-transform cursor-pointer",
                                    color === item
                                        ? "border-foreground scale-110 z-10"
                                        : "border-border hover:border-gray-300 hover:scale-105"
                                )}
                                style={{ backgroundColor: item }}
                                aria-pressed={color === item}
                            />
                        ))}
                    </div>
                </div>

                {/* Activo */}
                <div className="flex items-center justify-start gap-10 mt-6">
                    <label className="text-[15px] font-semibold text-gray-700">{t("active")}</label>
                    <input type="hidden" name="isActive" value={String(isActive)} />
                    <ActiveToggle
                        isActive={isActive}
                        onToggle={() => setIsActive((value) => !value)}
                    />
                </div>
            </div>

            {/* Botón para abrir modal de eliminación (solo en modo edición) */}
            {initialData?.subcategoryId && (
                <div className="mt-6">
                    <DeleteButton
                        onClick={() => setIsDeleteModalOpen(true)}
                        label={t("delete")}
                        className="w-1/2"
                    />
                </div>
            )}

            {/* Modal de confirmación para eliminación */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title={t("deleteTitle")}
                description={
                    <div>
                        <p className="mb-3">
                            {t("deleteDescription", { name: initialData?.name ?? "" })}
                        </p>
                        <p className="text-red-600 font-semibold">
                            {t("deleteWarning")}
                        </p>
                    </div>
                }
                validationText={initialData?.name || ""}
                inputPlaceholder={t("deletePlaceholder")}
                confirmButtonText={tCommon("delete")}
            />

            {/* Footer */}
            <div className="mt-6 px-6 py-4 flex justify-end gap-4 border-t border-gray-200">
                <CancelButton onClick={onCancel} className="px-12" />
                <SaveButton 
                    isPending={isPending} 
                    isValid={isFormValid}
                    label={initialData ? t("save") : t("create")}
                    form="subcategory-form"
                    className="px-12"
                />
            </div>
        </form>
    )
}
