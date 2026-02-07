'use client'

import React, { useState, useEffect, useActionState } from 'react'
import { toast } from "react-toastify"
import deleteTransaction from '@/src/actions/delete-transaction-action'
import { ActionStateType } from '@/src/types/action-types'
import { Transaction, currencies } from '@/src/types/transaction-types'
import { Account } from '@/src/types/account-types'
import { Category } from '@/src/types/category-types'
import { cn } from "@/src/lib/utils"
import { ToggleButton } from "@/src/components/ui/toggle-button"
import { DeleteButton } from "@/src/components/ui/delete-button"
import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"
import { DesmarcarButton } from "@/src/components/ui/desmarcar-button"
import ErrorMessage from '../ui/ErrorMessage'

interface TransactionFormProps {
    initialData?: Pick<Transaction, 'transactionId' | 'name' | 'date' | 'amount' | 'description' | 'type' | 'currency' | 'updatedAt' | 'accountId' | 'categoryId'>
    accounts: Account[]
    categories: Category[]  // Debe incluir categorías de ambos tipos (expenses/incomes)
    action: (prevState: ActionStateType, formData: FormData) => Promise<{ errors: string[]; success: string }>
    onSuccess: () => void
    onCancel: () => void
    mode: "expenses" | "incomes"  // Usado solo para establecer valor inicial del tipo
}

// Convierte fecha ISO a formato YYYY-MM-DD para input date
const toDateInputValue = (value?: string) => {
    if (!value) return ""
    const date = new Date(value)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export function TransactionForm({ initialData, accounts, categories, action, onSuccess, onCancel, mode }: TransactionFormProps) {
    // Estado para la acción principal (crear/editar)
    const [state, dispatch, isPending] = useActionState(action, {
        errors: [],
        success: "",
    })

    // Estados del formulario (componentes controlados)
    const [name, setName] = useState(initialData?.name || '')
    const [type, setType] = useState<'expense' | 'income'>(initialData?.type || (mode === "expenses" ? "expense" : "income"))

    const [account, setAccount] = useState(initialData?.accountId || '')
    const [category, setCategory] = useState(initialData?.categoryId || '')
    const [currency, setCurrency] = useState(initialData?.currency || '')

    const [date, setDate] = useState(() => toDateInputValue(initialData?.date))
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
    const [description, setDescription] = useState(initialData?.description || '')

    // Estado para la acción de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteState, deleteDispatch, isDeleting] = useActionState(deleteTransaction, {
        errors: [],
        success: "",
    })

    useEffect(() => {
        console.log('ACCOUNT: ', account)
    }, [account])

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

    // Handler para el cambio de divisa
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value
        setCurrency(newCurrency)
    }

    // Filtrar cuentas por la divisa seleccionada
    // Si hay una cuenta seleccionada, mostramos todas para permitir cambiar a otra divisa
    const filteredAccounts = account
        ? accounts
        : accounts.filter(acc => !currency || acc.currency === currency)

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
    }, [deleteState])

    // Maneja el envío de la acción de eliminación
    const handleDelete = () => {
        if (!initialData?.transactionId) return
        const formData = new FormData()
        formData.append("transactionId", initialData.transactionId)

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
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Cuenta</label>
                    <div className="relative gap-0">
                        <select
                            key={`account-${account}`}
                            name="account"
                            value={account}
                            onChange={handleAccountChange}
                            disabled={filteredAccounts.length === 0}
                            className={cn(
                                "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white",
                                filteredAccounts.length === 0 && "bg-gray-100 text-gray-500 cursor-not-allowed",
                                account && "pr-10"
                            )}
                        >
                            <option value="">
                                {filteredAccounts.length === 0
                                    ? "No hay cuentas con esta divisa"
                                    : "Selecciona una cuenta"}
                            </option>
                            {filteredAccounts.map(acc => (
                                <option key={acc.accountId} value={acc.accountId}>
                                    {acc.name} - {acc.currency}
                                </option>
                            ))}
                        </select>

                        {account && (
                            <DesmarcarButton
                                onClick={() => setAccount("")}
                                title="Quitar cuenta seleccionada"
                            />
                        )}
                    </div>
                </div>

                {/* Selector de categoría (filtrada por tipo) */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Categoría</label>
                    <select
                        key={`category-${category}`}
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.filter(cat => cat.type === type).map(cat => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

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
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Divisa</label>
                    {/* Input hidden para enviar el valor cuando el select está deshabilitado */}
                    {account && <input type="hidden" name="currency" value={currency} />}
                    <div className="relative">
                        <select
                            key={`currency-${currency}`}
                            name={account ? undefined : "currency"} // Evitar duplicidad de name si está habilitado
                            value={currency}
                            onChange={handleCurrencyChange}
                            disabled={!!account}
                            className={cn(
                                "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white",
                                account && "bg-gray-100 text-gray-500 cursor-not-allowed", // Estilo visual "fondo gris claro"
                                !account && currency && "pr-10"
                            )}
                        >
                            <option value="">Selecciona una divisa</option>
                            {currencies.map((curr) => (
                                <option key={curr.currency} value={curr.currency}>
                                    {curr.currency} - {curr.description}
                                </option>
                            ))}
                        </select>
                        {!account && currency && (
                            <DesmarcarButton
                                onClick={() => setCurrency("")}
                                title="Quitar divisa seleccionada"
                            />
                        )}
                    </div>
                </div>

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
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-2.5 rounded-lg bg-gray-100 text-[15px] text-gray-700 hover:bg-gray-200 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid || isPending}
                    className={cn(
                        "px-8 py-2.5 rounded-lg text-[15px] text-white transition-colors",
                        isFormValid && !isPending
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-gray-400 cursor-not-allowed opacity-70"
                    )}
                >
                    {isPending ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    )
}