'use client'

import { useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { ActionStateType } from "@/src/types/action-types"
import { Account, accountTypeOptions, AccountType, AccountTypeValue } from "@/src/types/account-types"
import { BaseCurrency, currencies } from "@/src/types/transaction-types"
import { CancelButton } from "@/src/components/ui/cancel-button"
import { SaveButton } from "@/src/components/ui/save-button"

type Props = {
  initialData?: Account | null
  action: (prevState: ActionStateType, formData: FormData) => Promise<ActionStateType>
  onSuccess: () => void
  onCancel: () => void
  title: string
  submitLabel: string
}

function normalizeAccountType(type?: AccountTypeValue): string {
  if (!type) return accountTypeOptions[0]?.label ?? ""
  const value = String(type)
  return value in AccountType ? AccountType[value as keyof typeof AccountType] : value
}

export function AccountForm({ initialData, action, onSuccess, onCancel, title, submitLabel }: Props) {
  const [state, dispatch, isPending] = useActionState(action, {
    errors: [],
    success: "",
  })

  const [name, setName] = useState(initialData?.name ?? "")
  const [type, setType] = useState(normalizeAccountType(initialData?.type))
  const [currency, setCurrency] = useState<BaseCurrency>(initialData?.currency ?? "EUR")
  const [balance, setBalance] = useState(initialData?.balance ?? "0")
  const [number, setNumber] = useState(initialData?.number ?? "")
  const [isActive] = useState(initialData?.isActive ?? true)
  const [bankId] = useState(initialData?.bankId ?? 1)

  const isFormValid =
    name.trim().length > 0 &&
    type.trim().length > 0 &&
    currency.trim().length > 0 &&
    balance.trim().length > 0

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

  return (
    <form id="account-form" action={dispatch} className="p-6">
      <input type="hidden" name="accountId" value={initialData?.accountId ?? ""} />
      <input type="hidden" name="isActive" value={String(isActive)} />
      <input type="hidden" name="bankId" value={String(bankId)} />
      <input type="hidden" name="order" value={String(initialData?.order ?? "")} />

      <h2 className="text-2xl font-semibold text-gray-900 mb-5">{title}</h2>

      {state.errors.length > 0 && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.errors.join(" ")}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="account-name" className="block text-[15px] font-semibold text-gray-700 mb-1">
            Nombre
          </label>
          <input
            id="account-name"
            name="name"
            type="text"
            placeholder="Ej: Cuenta Nómina"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="account-type" className="block text-[15px] font-semibold text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="account-type"
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:border-primary"
          >
            {accountTypeOptions.map((option) => (
              <option key={option.key} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="account-currency" className="block text-[15px] font-semibold text-gray-700 mb-1">
            Moneda
          </label>
          <select
            id="account-currency"
            name="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as BaseCurrency)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:border-primary"
          >
            {currencies.map((item) => (
              <option key={item.currency} value={item.currency}>
                {item.currency} - {item.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="account-balance" className="block text-[15px] font-semibold text-gray-700 mb-1">
            Saldo inicial
          </label>
          <input
            id="account-balance"
            name="balance"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={balance}
            onChange={(event) => setBalance(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="account-number" className="block text-[15px] font-semibold text-gray-700 mb-1">
            Últimos 4 dígitos
          </label>
          <input
            id="account-number"
            name="number"
            type="text"
            maxLength={4}
            placeholder="1234"
            value={number}
            onChange={(event) => setNumber(event.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-4">
        <CancelButton onClick={onCancel} className="px-10" />
        <SaveButton
          isPending={isPending}
          isValid={isFormValid}
          label={submitLabel}
          pendingLabel="Guardando..."
          form="account-form"
          className="px-10"
        />
      </div>
    </form>
  )
}
