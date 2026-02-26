'use client'

import { Account } from '@/src/types/account-types'
import { cn } from "@/src/lib/utils"
import { DesmarcarButton } from "@/src/components/ui/desmarcar-button"
import { useLocale, useTranslations } from "next-intl"

interface AccountSelectorProps {
    account: string | number
    accounts: Account[]
    currency: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onClear: () => void
}

// Selector de cuenta bancaria con filtrado por divisa
export function AccountSelector({ account, accounts, currency, onChange, onClear }: AccountSelectorProps) {
    const t = useTranslations("Selectors")
    const locale = useLocale()

    // Cuando hay cuenta seleccionada, mostramos todas (permite cambiar a otra divisa)
    // Sin selección, filtramos solo cuentas con la divisa elegida
    const filteredAccounts = account
        ? accounts
        : accounts.filter(acc => !currency || acc.currency === currency)

    return (
        <div>
            <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("account")}</label>
            <div className="relative gap-0">
                <select
                    key={`account-${account}`}
                    name="account"
                    value={account}
                    onChange={onChange}
                    disabled={filteredAccounts.length === 0}
                    className={cn(
                        "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white",
                        filteredAccounts.length === 0 && "bg-gray-100 text-gray-500 cursor-not-allowed",
                        account && "pr-10"
                    )}
                >
                    {/* Opción por defecto */}
                    <option value="">
                        {filteredAccounts.length === 0
                            ? t("accountNoCurrency")
                            : t("accountPlaceholder")}
                    </option>
                    {/* Opciones filtradas por divisa */}
                    {filteredAccounts.map(acc => (
                        <option key={acc.accountId} value={acc.accountId}>
                            {acc.name} - {new Intl.DisplayNames([locale], { type: "currency" }).of(acc.currency)}
                        </option>
                    ))}
                </select>

                {/* Botón para limpiar selección (solo si hay una cuenta seleccionada) */}
                {account && (
                    <DesmarcarButton
                        onClick={onClear}
                        title={t("clearSelectedAccount")}
                    />
                )}
            </div>
        </div>
    )
}
