'use client'

import React, { useState, useEffect, useActionState } from 'react'
import { toast } from "react-toastify"
import { deleteTransaction } from '@/src/data-layer/transactions'
import { ActionStateType } from '@/src/types/action-types'
import { Transaction } from '@/src/types/transaction-types'
import { Account } from '@/src/types/account-types'
import { Category, Subcategory } from '@/src/types/category-types'
import { cn } from "@/src/lib/utils"
import { ToggleButton } from "@/src/components/ui/toggle-button"
import { DeleteButton } from "@/src/components/ui/delete-button"
import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"
import { CancelButton } from "@/src/components/ui/cancel-button"
import { SaveButton } from "@/src/components/ui/save-button"
import { toDateInputValue } from '@/src/helpers/date-helpers'
import { useSubcategoriesForCategory } from '@/src/hooks/use-subcategories-for-category'
import { AccountSelector } from './account-selector'
import { CategorySelector } from './category-selector'
import { SubcategorySelector } from './subcategory-selector'
import { CurrencySelector } from './currency-selector'
import ErrorMessage from '../ui/ErrorMessage'

interface TransactionFormProps {
    initialData?: Pick<Transaction, 'transactionId' | 'name' | 'date' | 'amount' | 'description' | 'type' | 'currency' | 'updatedAt' | 'accountId' | 'categoryId' | 'subcategoryId'>
    accounts: Account[]
    categories: Category[]  // Debe incluir categorías de ambos tipos (expenses/incomes)
    action: (prevState: ActionStateType, formData: FormData) => Promise<{ errors: string[]; success: string }>
    onSuccess: () => void
    onCancel: () => void
    mode: "expenses" | "incomes"  // Usado solo para establecer valor inicial del tipo
    defaultCategoryId?: string | number
    defaultSubcategoryId?: number
    subcategories?: Subcategory[]  // Subcategorías precargadas (opcional)
}

export function TransactionForm({ initialData, accounts, categories, action, onSuccess, onCancel, mode, defaultCategoryId, defaultSubcategoryId, subcategories }: TransactionFormProps) {
    // Estado para la acción principal (crear/editar)
    const [state, dispatch, isPending] = useActionState(action, {
        errors: [],
        success: "",
    })

    // Estados del formulario (componentes controlados)
    const [name, setName] = useState(initialData?.name || '')
    const [type, setType] = useState<'expense' | 'income'>(initialData?.type || (mode === "expenses" ? "expense" : "income"))

    // campos relacionados entre sí (cuenta/divisa y categoría/subcategoría) se manejan con handlers específicos para actualizar su estado de forma coordinada
    const [account, setAccount] = useState(initialData?.accountId || '')
    const [category, setCategory] = useState(initialData?.categoryId || defaultCategoryId || '')
    const [subcategory, setSubcategory] = useState<string>(initialData?.subcategoryId?.toString() || defaultSubcategoryId?.toString() || '')
    const [currency, setCurrency] = useState(initialData?.currency || '')

    // Hook para cargar subcategorías según la categoría seleccionada
    const availableSubcategories = useSubcategoriesForCategory(category, categories, subcategories)

    // Estados para campos individuales
    const [date, setDate] = useState(() => toDateInputValue(initialData?.date))
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
    const [description, setDescription] = useState(initialData?.description || '')

    // Estado para la acción de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteState, deleteDispatch, isDeleting] = useActionState(deleteTransaction, {
        errors: [],
        success: "",
    })

    // Handler para el cambio de cuenta
    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAccountId = e.target.value
        setAccount(selectedAccountId)

        // Si se selecciona una cuenta, actualizar y bloquear la divisa
        if (selectedAccountId) {
            const selectedAccount = accounts.find(acc => String(acc.accountId) === selectedAccountId)
            if (selectedAccount) {
                setCurrency(selectedAccount.currency)
            }
        }
    }

    // Handler para el cambio de categoría
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value
        setCategory(newCategory)
        setSubcategory('') // Limpiar subcategoría al cambiar de categoría
    }

    // Handler para el cambio de divisa
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value
        setCurrency(newCurrency)
    }

    // Validación: todos los campos requeridos deben tener valor
    // const isFormValid = name.trim().length > 0 && type && account && category && date && amount && currency;
    const isFormValid = true

    // Mostrar toast notifications según resultado de la acción
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
        if (!initialData?.transactionId) return
        const formData = new FormData()
        formData.append("transactionId", initialData.transactionId)
        formData.append("categoryId", initialData.categoryId)

        React.startTransition(() => {
            deleteDispatch(formData)
        })
    }

    return (
        <form
            id="transaction-form"
            className="flex-1 p-6 overflow-hidden"
            action={dispatch}  // Se usa useActionState en lugar de onSubmit tradicional
        >
            {/* Campos hidden para datos que no vienen de inputs visibles */}
            <input type="hidden" name="transactionId" value={initialData?.transactionId || ""} />
            {/* A la hora de actualizar sirve para enviarlo al endpoint e identificar la categoría previa, por si se actualiza a una nueva categoría */}
            <input type="hidden" name="previousCategoryId" value={initialData?.categoryId || ""} />
            <input type="hidden" name="previousSubcategoryId" value={initialData?.subcategoryId || ""} />

            {/* Mensajes de error de la acción principal */}
            {state.errors.length > 0 && (
                <div className="px-6 pt-5">
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {state.errors.map((error, index) => (
                            <ErrorMessage key={`${error}-${index}`}>{error}</ErrorMessage>
                        ))}
                    </div>
                </div>
            )}

            {/* Título del formulario */}
            <h2 className="text-[26px] font-semibold mb-4">
                {initialData ? "Editar Movimiento" : "Crear Movimiento"}
            </h2>

            <div className="flex flex-col gap-4">

                {/* Selector de tipo (gasto/ingreso) */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-2">Tipo</label>
                    <input type="hidden" name="type" value={type} />
                    <div className="relative bg-gray-100 rounded-lg p-1 h-11 flex items-center">
                        {/* Indicador visual que se desliza según el tipo seleccionado */}
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

                {/* Input nombre */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del movimiento"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Selector de cuenta */}
                <AccountSelector
                    account={account}
                    accounts={accounts}
                    currency={currency}
                    onChange={handleAccountChange}
                    onClear={() => setAccount("")}
                />

                {/* Selector de categoría (filtrada por tipo) */}
                <CategorySelector
                    category={category}
                    categories={categories}
                    type={type}
                    disabled={!!defaultSubcategoryId}
                    onChange={handleCategoryChange}
                />

                {/* Selector de subcategoría (solo si la categoría tiene subcategorías) */}
                <SubcategorySelector
                    subcategory={subcategory}
                    availableSubcategories={availableSubcategories}
                    disabled={!!defaultSubcategoryId}
                    onChange={(e) => setSubcategory(e.target.value)}
                    onClear={() => setSubcategory("")}
                />

                {/* Input fecha */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Fecha</label>
                    <div className="relative">
                        <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Input cantidad */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Cantidad</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="amount"
                            min={0}
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Selector de divisa */}
                <CurrencySelector
                    currency={currency}
                    account={account}
                    onChange={handleCurrencyChange}
                    onClear={() => setCurrency("")}
                />

                {/* Textarea descripción */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                        Descripción <span className="text-xs font-normal text-gray-500">({description.length}/500)</span>
                    </label>
                    <textarea
                        name="description"
                        value={description}
                        maxLength={500}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary min-h-24 max-h-72 resize-y"
                        placeholder="Añade una descripción (opcional)"
                    />
                </div>
            </div>

            {/* Botón para abrir modal de eliminación (solo en modo edición) */}
            {initialData?.transactionId && (
                <div className="mt-4">
                    <DeleteButton
                        onClick={() => setIsDeleteModalOpen(true)}
                        label="Eliminar Movimiento"
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
                title="Confirmar Eliminación"
                description={
                    <p>
                        Escribe el nombre del movimiento <strong>{initialData?.name}</strong> para confirmar la eliminación.
                    </p>
                }
                validationText={initialData?.name || ""}
                inputPlaceholder="Nombre del movimiento"
                confirmButtonText="Eliminar"
            />

            {/* Botones de acción del formulario */}
            <div className="mt-6 pt-4 flex justify-end gap-4 border-t border-gray-200">
                <CancelButton onClick={onCancel} />
                <SaveButton
                    isPending={isPending}
                    isValid={isFormValid}
                    label="Guardar"
                />
            </div>
        </form>
    )
}