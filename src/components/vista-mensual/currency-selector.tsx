'use client'

import { currencies } from '@/src/types/transaction-types'
import { cn } from "@/src/lib/utils"
import { DesmarcarButton } from "@/src/components/ui/desmarcar-button"
import { useLocale, useTranslations } from "next-intl"

interface CurrencySelectorProps {
    currency: string
    account: string | number   // Si hay cuenta seleccionada, la divisa viene de la cuenta
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onClear: () => void
}

/**
 * Selector de divisa con opción para limpiar selección
 * Se deshabilita cuando hay una cuenta seleccionada (la cuenta define la divisa)
 * forma parte del formulario de transacción
 */
export function CurrencySelector({ currency, account, onChange, onClear }: CurrencySelectorProps) {
    const t = useTranslations("Selectors")
    const locale = useLocale()

    return (
        <div>
            <label className="block text-[15px] font-semibold text-gray-700 mb-1">{t("currency")}</label>

            {/* Cuando la divisa viene de la cuenta, se envía como hidden en lugar de usar el select */}
            {account && <input type="hidden" name="currency" value={currency} />}

            <div className="relative">
                <select
                    key={`currency-${currency}`} // Forzar re-render cuando cambia la divisa
                    name={account ? undefined : "currency"} // Evita enviar valores duplicados en el FormData
                    value={currency}
                    onChange={onChange}
                    disabled={!!account} // Deshabilitado si la cuenta ya define la divisa
                    className={cn(
                        "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white",
                        account && "bg-gray-100 text-gray-500 cursor-not-allowed",
                        !account && currency && "pr-10" // Espacio para el botón de limpiar
                    )}
                >
                    <option value="">{t("currencyPlaceholder")}</option>
                    {currencies.map((curr) => (
                        <option key={curr.currency} value={curr.currency}>
                            {curr.currency} - {new Intl.DisplayNames([locale], { type: "currency" }).of(curr.currency)}
                        </option>
                    ))}
                </select>

                {/* Botón para limpiar selección manual (solo cuando no hay cuenta) */}
                {!account && currency && (
                    <DesmarcarButton
                        onClick={onClear}
                        title={t("clearSelectedCurrency")}
                    />
                )}
            </div>
        </div>
    )
}
