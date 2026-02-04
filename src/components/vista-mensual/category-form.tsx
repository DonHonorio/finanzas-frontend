'use client'

import { useActionState, useEffect, useState } from "react"
import { FrequencyField } from "@/src/components/ui/frequency-field"
import { cn, colorOptions, iconOptions } from "@/src/lib/utils"
import ErrorMessage from "../ui/ErrorMessage"
import { toast } from "react-toastify"
import { ToggleButton } from "@/src/components/ui/toggle-button"
import { ActiveToggle } from "@/src/components/ui/active-toggle"
import { ActionStateType } from "@/src/types/action-types"

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
        categoryId?: string
    }
    action: (prevState: ActionStateType, formData: FormData) => Promise<{ errors: string[]; success: string }>
    onSuccess: () => void
    onCancel: () => void
    mode?: "expenses" | "incomes"
}

const toDateInputValue = (value?: string) => {
    if (!value) return ""
    const date = new Date(value)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export function CategoryForm({ initialData, action, onSuccess, onCancel, mode }: Props) {
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
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "")

    // Función para resetear el formulario (solo para createCategory)
    const resetForm = () => {
        if (!initialData) {
            setName("")
            setBudget("")
            setFrequency("")
            setDtstart("")
            setType("expense")
            setIcon(iconOptions[0])
            setColor(colorOptions[0])
            setIsActive(true)
        }
    }

    // Flags de UI
    const isFormValid =
        name.trim().length > 0 &&
        budget !== "" &&
        dtstart !== "" &&
        (frequency || "").length > 0

    // Efecto para manejar el éxito de la acción
    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            resetForm()
            onSuccess()
        }
    }, [state])

    return (
        <form
            id="category-form"
            className="flex-1 p-6 overflow-hidden"
            action={dispatch}
        >
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
                {initialData ? "Editar Categoría" : "Crear Categoría"}
            </h2>

            {/* Grilla principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(72vh-210px)]">
                {/* COLUMNA IZQUIERDA */}
                <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre de la categoría"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Presupuesto */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">Presupuesto</label>
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
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">Frecuencia</label>
                        <FrequencyField
                            frequency={frequency}
                            onChange={setFrequency}
                            name="frequency"
                        />
                    </div>

                    {/* Fecha de inicio */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
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
                        <label className="block text-[15px] font-semibold text-gray-700 mb-2">Tipo</label>
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
                                label="Gasto"
                                onClick={() => setType('expense')}
                            />
                            <ToggleButton
                                isActive={type === 'income'}
                                label="Ingreso"
                                onClick={() => setType('income')}
                            />
                        </div>
                    </div>

                    {/* Icono */}
                    <div>
                        <label className="block text-[15px] font-semibold text-gray-700 mb-2">Icono</label>
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
                        <label className="block text-[15px] font-semibold text-gray-700 mb-2">Color</label>
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
                        <label className="text-[15px] font-semibold text-gray-700">Activo</label>
                        <input type="hidden" name="isActive" value={String(isActive)} />
                        <ActiveToggle
                            isActive={isActive}
                            onToggle={() => setIsActive((value) => !value)}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end gap-4 bg-gray-50 border-t border-gray-200">
                {/* Botón cancelar */}
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-12 py-2.5 rounded-lg bg-[#F3F2F2] text-[15px] text-gray-700 hover:bg-[#EAEAEA]"
                >
                    Cancelar
                </button>

                {/* Botón guardar/crear */}
                <button
                    type="submit"
                    form="category-form"
                    disabled={!isFormValid || isPending}
                    className={cn(
                        "px-12 py-2.5 rounded-lg text-[15px] text-gray-900 transition",
                        isFormValid && !isPending
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    )}
                >
                    {isPending ? "Guardando..." : initialData ? "Guardar" : "Crear"}
                </button>
            </div>
        </form>
    )
}