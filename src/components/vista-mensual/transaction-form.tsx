'use client';

import React, { useState, useEffect, useActionState } from 'react'
import { toast } from "react-toastify"
import deleteTransaction from '@/src/actions/delete-transaction-action'
import { ActionStateType } from '@/src/types/action-types';
import { Transaction } from '@/src/types/transaction-types';
import { Account } from '@/src/types/account-types';
import { Category } from '@/src/types/category-types';
import { cn } from "@/src/lib/utils"
import { ToggleButton } from "@/src/components/ui/toggle-button"
import { DeleteButton } from "@/src/components/ui/delete-button"
import { DeleteConfirmationModal } from "@/src/components/ui/delete-confirmation-modal"

// Props
interface TransactionFormProps {
    initialData?: Pick<Transaction, 'transactionId' | 'name' | 'date' | 'amount' | 'description' | 'type' | 'currency' | 'updatedAt' | 'accountId' | 'categoryId'>
    accounts: Account[]
    categories: Category[]
    action: (prevState: ActionStateType, formData: FormData) => Promise<{ errors: string[]; success: string }>
    onSuccess: () => void
    onCancel: () => void
}

const toDateInputValue = (value?: string) => {
    if (!value) return ""
    const date = new Date(value)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export function TransactionForm({ initialData, accounts, categories, action, onSuccess, onCancel }: TransactionFormProps) {
    // Estado para manejar la acción de crear/editar transacciones
    const [state, dispatch, isPending] = useActionState(action, {
        errors: [],
        success: "",
    });

    // Estado del formulario
    const [name, setName] = useState(initialData?.name || '');
    const [type, setType] = useState<'expense' | 'income'>(initialData?.type || 'expense');
    const [account, setAccount] = useState(initialData?.accountId || '');
    const [category, setCategory] = useState(initialData?.categoryId || '');
    const [date, setDate] = useState(() => toDateInputValue(initialData?.date));
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [currency, setCurrency] = useState(initialData?.currency as string || 'EUR');
    const [description, setDescription] = useState(initialData?.description || '');

    // Estado para el modal de confirmación de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteState, deleteDispatch, isDeleting] = useActionState(deleteTransaction, {
        errors: [],
        success: "",
    });

    // Validación del formulario
    const isFormValid = name.trim().length > 0 && type && account && category && date && amount && currency;

    // Manejar el éxito o error de las acciones (crear/editar y eliminar)
    useEffect(() => {
        if (state.success) {
            toast.success(state.success);
            onSuccess();
        }
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
    }, [state]);

    useEffect(() => {
        if (deleteState.success) {
            toast.success(deleteState.success);
            onSuccess();
        }
        if (deleteState.errors.length > 0) {
            deleteState.errors.forEach((error) => toast.error(error));
        }
    }, [deleteState]);

    // Manejar la eliminación de una transacción
    const handleDelete = () => {
        if (!initialData?.transactionId) return;
        const formData = new FormData();
        formData.append("transactionId", initialData.transactionId);

        React.startTransition(() => {
            deleteDispatch(formData);
        });
    };

    return (
        <form
            id="transaction-form"
            className="flex-1 p-6 overflow-hidden"
            action={dispatch}
        >
            <input type="hidden" name="transactionId" value={initialData?.transactionId || ""} />
            <input type="hidden" name="previousCategoryId" value={initialData?.categoryId || ""} />

            {/* Mensajes de error */}
            {state.errors.length > 0 && (
                <div className="px-6 pt-5">
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {state.errors.map((error, index) => (
                            <p key={index} className="text-red-500">{error}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Título dinámico */}
            <h2 className="text-[26px] font-semibold mb-4">
                {initialData ? "Editar Movimiento" : "Crear Movimiento"}
            </h2>

            {/* Layout principal - Una sola columna con espacio entre elementos */}
            <div className="flex flex-col gap-4">
                
                {/* Tipo - Componente Toggle */}
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

                {/* Nombre */}
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

                {/* Cuenta */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Cuenta</label>
                    <select
                        name="account"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                    >
                        <option value="">Selecciona una cuenta</option>
                        {accounts.map(acc => (
                            <option key={acc.accountId} value={acc.accountId}>
                                {acc.name} - {acc.currency}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Categoría</label>
                    <select
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

                {/* Fecha */}
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

                {/* Cantidad */}
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

                {/* Divisa */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Divisa</label>
                    <select
                        name="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        {/* Agregar más opciones de divisas si es necesario */}
                    </select>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">Descripción</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary min-h-[80px]"
                        placeholder="Añade una descripción (opcional)"
                    />
                </div>
            </div>

            {/* Botón de eliminar transacción */}
            {initialData?.transactionId && (
                <div className="mt-4">
                    <DeleteButton
                        onClick={() => setIsDeleteModalOpen(true)}
                        label="Eliminar Movimiento"
                        className="w-1/2"
                    />
                </div>
            )}

            {/* Modal de confirmación */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Confirmar Eliminación"
                description={
                    <p>
                        Escribe la descripción del movimiento <strong>{initialData?.description}</strong> para confirmar la eliminación.
                    </p>
                }
                validationText={initialData?.description || ""}
                inputPlaceholder="Descripción del movimiento"
                confirmButtonText="Eliminar"
            />

            {/* Footer */}
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
    );
}