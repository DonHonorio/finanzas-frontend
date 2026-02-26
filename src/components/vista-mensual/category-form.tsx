'use client'

import { useActionState, useEffect, useState } from "react"
import { FrequencyField } from "@/src/components/ui/frequency-field"
import { cn, colorOptions, iconOptions } from "@/src/lib/utils"
import ErrorMessage from "../ui/ErrorMessage"
import { toast } from "react-toastify"
import { ToggleButton } from "@/src/components/ui/toggle-button"
import { ActiveToggle } from "@/src/components/ui/active-toggle"
import { ActionStateType } from "@/src/types/action-types"
import { deleteCategory } from "@/src/data-layer/categories"
import React from "react"
import { DeleteButton } from "@/src/components/ui/delete-button"
import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"
import { CancelButton } from "@/src/components/ui/cancel-button"
import { SaveButton } from "@/src/components/ui/save-button"
import { toDateInputValue } from '@/src/helpers/date-helpers'
import { useTranslations } from "next-intl"

// Props
type Props = {
    initialData?: {
        name: string
        budget: string
        frequency: string
        type: 'expense' | 'income'
        dtstart: string
        icon: string
        color: string
        isActive: boolean
        withSubcategory: boolean
        categoryId?: string
    }
    action: (prevState: ActionStateType, formData: FormData) => Promise<{ errors: string[]; success: string }>
    onSuccess: () => void
    onCancel: () => void
    mode?: "expenses" | "incomes"
}

export function CategoryForm({ initialData, action, onSuccess, onCancel, mode }: Props) {
    const t = useTranslations("CategoryForm")
    const tTransaction = useTranslations("TransactionForm")
    const tCommon = useTranslations("CommonButtons")
    const [state, dispatch, isPending] = useActionState(action, {
        errors: [],
        success: ''
    })

    // Estado del formulario
    const [name, setName] = useState(initialData?.name || "")
    const [budget, setBudget] = useState(initialData?.budget || "")
    const [frequency, setFrequency] = useState(initialData?.frequency || "FREQ=DAILY;COUNT=1")
    const [type, setType] = useState<'expense' | 'income'>(initialData?.type || (mode === "expenses" ? "expense" : "income"))
    const [dtstart, setDtstart] = useState(() => toDateInputValue(initialData?.dtstart))
    const [icon, setIcon] = useState(initialData?.icon || iconOptions[0])
    const [color, setColor] = useState(initialData?.color || colorOptions[0])
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
    const [withSubcategory, setWithSubcategory] = useState(initialData?.withSubcategory ?? false)

    // Flags de UI
    const isFormValid =
        name.trim().length > 0 &&
        budget !== "" &&
        dtstart !== "" &&
        (frequency || "").length > 0

    // Estado para el modal de confirmación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteState, deleteDispatch, isDeleting] = useActionState(deleteCategory, {
        errors: [],
        success: ""
    })

    // Manejar el éxito o error de los actions (crear/editar y eliminar)
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

    // Manejar el resultado de la eliminación
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

    // Función para manejar la eliminación de la categoría
    const handleDelete = () => {
        if (!initialData?.categoryId) return
        const formData = new FormData()
        formData.append("categoryId", initialData.categoryId)

        // Usar startTransition para manejar la transición
        React.startTransition(() => {
            deleteDispatch(formData)
        })
    }

    return (
        <form
            id="category-form"
            className="flex-1 p-6 overflow-hidden"
            action={dispatch}
        >
            <input type="hidden" name="categoryId" value={initialData?.categoryId || ""} />
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

            {/* Grilla principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUMNA IZQUIERDA */}
                <div className="space-y-4">
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

                    {/* Frecuencia */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("frequency")}</label>
                        <FrequencyField
                            frequency={frequency}
                            onChange={setFrequency}
                            name="frequency"
                        />
                    </div>

                    {/* Fecha de inicio */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("startDate")}</label>
                        <input
                            type="date"
                            name="dtstart"
                            value={dtstart}
                            onChange={(event) => setDtstart(event.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-4">
                    {/* Tipo */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-2">{t("type")}</label>
                        <input type="hidden" name="type" value={type} />
                        <div className="relative bg-gray-100 rounded-lg p-1 h-11 flex items-center">
                            <div
                                className={cn(
                                    "absolute top-1 left-1 h-9 w-[calc(50%-4px)] bg-primary text-primary-foreground rounded-md shadow transition-all duration-300",
                                    type === 'income' ? "translate-x-full" : ""
                                )}
                            />
                            <ToggleButton
                                isActive={type === 'expense'}
                                label={tTransaction("expense")}
                                onClick={() => setType('expense')}
                            />
                            <ToggleButton
                                isActive={type === 'income'}
                                label={tTransaction("income")}
                                onClick={() => setType('income')}
                            />
                        </div>
                    </div>

                    {/* Icono */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-2">{t("icon")}</label>
                        <input type="hidden" name="icon" value={icon} />
                        <div className="grid grid-cols-8 gap-2">
                            {iconOptions.map((item, index) => (
                                <button
                                    key={`${item}-${index}`}
                                    type="button"
                                    onClick={() => setIcon(item)}
                                    className={cn(
                                        "h-11 w-11 rounded-md border text-lg flex items-center justify-center transition-transform cursor-pointer select-none",
                                        icon === item
                                            ? "border-primary bg-primary/10 scale-110 z-10"
                                            : "border-gray-200 hover:border-primary hover:bg-primary/10 hover:scale-105"
                                    )}
                                    aria-pressed={icon === item}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
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

                    {/* Con Subcategorías */}
                    <div className="flex items-center justify-start gap-10 mb-5">
                        <label className="text-[15px] font-semibold text-gray-700">{t("withSubcategories")}</label>
                        <input type="hidden" name="withSubcategory" value={String(withSubcategory)} />
                        <ActiveToggle
                            isActive={withSubcategory}
                            onToggle={() => setWithSubcategory((value) => !value )}
                        />
                    </div>
                </div>
            </div>

            {/* Botón de eliminar categoría */}
            {initialData?.categoryId && (
                <div className="mt-0">
                        <DeleteButton
                            onClick={() => setIsDeleteModalOpen(true)}
                            label={t("delete")}
                            className="mb-5 px-12 py-2.5"
                        />
                </div>
            )}

            {/* Modal de confirmación */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title={t("deleteTitle")}
                description={
                    <p>
                        {t("deleteDescription", { name: initialData?.name ?? "" })}
                    </p>
                }
                validationText={initialData?.name || ""}
                inputPlaceholder={t("deletePlaceholder")}
                confirmButtonText={tCommon("delete")}
            />

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end gap-4 border-t border-gray-200">
                {/* Botón cancelar */}
                <CancelButton onClick={onCancel} className="px-12" />

                {/* Botón guardar/crear */}
                <SaveButton 
                    isPending={isPending} 
                    isValid={isFormValid}
                    label={initialData ? t("save") : t("create")}
                    form="category-form"
                    className="px-12"
                />
            </div>
        </form>
    )
}
