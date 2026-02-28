'use client'

import { Account, AccountType } from "@/src/types/account-types"
import { useLocale, useTranslations } from "next-intl"

type Props = {
  accounts: Account[]
  mutatingAccountId: number | null
  onEdit: (account: Account) => void
  onToggleActive: (account: Account) => void
  onDelete: (account: Account) => void
}

// Traduce type al label visible incluso si el dato viene como key enum.
function getTypeKey(type: Account["type"]) {
  const value = String(type)
  if (value in AccountType) {
    return value as keyof typeof AccountType
  }

  const entry = Object.entries(AccountType).find(([, label]) => label === value)
  return (entry?.[0] as keyof typeof AccountType | undefined) ?? "OTRO"
}

// Formatea saldo en la moneda de la propia cuenta para coherencia visual.
function formatBalance(balance: string, currency: string, locale: string) {
  const amount = Number(balance)
  if (Number.isNaN(amount)) return `${balance} ${currency}`

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

export function AccountsTable({ accounts, mutatingAccountId, onEdit, onToggleActive, onDelete }: Props) {
  const t = useTranslations("AccountsTable")
  const tAccountForm = useTranslations("AccountForm")
  const tAccountTypes = useTranslations("AccountTypes")
  const tCommon = useTranslations("CommonButtons")
  const locale = useLocale()

  return (
    <>
      {/* Móvil/Tablet: tarjetas para evitar overflow horizontal */}
      <div className="lg:hidden p-3 space-y-3">
        {accounts.map((account) => {
          const isMutatingRow = mutatingAccountId === account.accountId
          const isInactive = !account.isActive
          return (
            <article
              key={account.accountId}
              className={`rounded-xl border p-3 space-y-3 transition-colors ${
                isInactive ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${isInactive ? "text-gray-600" : "text-gray-800"}`}>{account.name}</h3>
                  <p className={`text-xs truncate ${isInactive ? "text-gray-600" : "text-gray-500"}`}>{tAccountTypes(getTypeKey(account.type))}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0 ${
                    account.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {account.isActive ? t("active") : t("inactive")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`rounded-lg p-2 ${isInactive ? "bg-gray-200" : "bg-gray-50"}`}>
                  <p className={isInactive ? "text-gray-600" : "text-gray-500"}>{t("currency")}</p>
                  <p className={`font-medium ${isInactive ? "text-gray-600" : "text-gray-800"}`}>{account.currency}</p>
                </div>
                <div className={`rounded-lg p-2 ${isInactive ? "bg-gray-200" : "bg-gray-50"}`}>
                  <p className={isInactive ? "text-gray-600" : "text-gray-500"}>{t("number")}</p>
                  <p className={`font-medium ${isInactive ? "text-gray-600" : "text-gray-800"}`}>{account.number ? `****${account.number}` : t("withoutNumber")}</p>
                </div>
                <div className={`col-span-2 rounded-lg p-2 ${isInactive ? "bg-gray-200" : "bg-gray-50"}`}>
                  <p className={isInactive ? "text-gray-600" : "text-gray-500"}>{t("balance")}</p>
                  <p className={`font-semibold ${isInactive ? "text-gray-600" : "text-gray-800"}`}>{formatBalance(account.balance, account.currency, locale)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(account)}
                  className="px-2 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                >
                  {t("edit")}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleActive(account)}
                  disabled={isMutatingRow}
                  className="px-2 py-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  {isMutatingRow ? tAccountForm("pending") : account.isActive ? t("disable") : t("enable")}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(account)}
                  className="px-2 py-1.5 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-xs"
                >
                  {tCommon("delete")}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* Desktop: tabla completa */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="w-full min-w-[860px]">
          {/* Cabecera con columnas base de gestión de cuentas. */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("name")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("type")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("currency")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("balance")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("number")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("state")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              // Bloquea solo la fila en curso para no congelar toda la tabla durante un toggle.
              const isMutatingRow = mutatingAccountId === account.accountId
              const isInactive = !account.isActive
              return (
                <tr
                  key={account.accountId}
                  className={`border-b transition-colors ${
                    isInactive ? "border-gray-200 bg-gray-100 hover:bg-gray-200/70" : "border-gray-100 hover:bg-gray-50/70"
                  }`}
                >
                  <td className={`px-4 py-3 text-sm font-medium ${isInactive ? "text-gray-600" : "text-gray-800"}`}>{account.name}</td>
                  <td className={`px-4 py-3 text-sm ${isInactive ? "text-gray-500" : "text-gray-600"}`}>{tAccountTypes(getTypeKey(account.type))}</td>
                  <td className={`px-4 py-3 text-sm ${isInactive ? "text-gray-500" : "text-gray-600"}`}>{account.currency}</td>
                  <td className={`px-4 py-3 text-sm text-right ${isInactive ? "text-gray-600" : "text-gray-800"}`}>{formatBalance(account.balance, account.currency, locale)}</td>
                  <td className={`px-4 py-3 text-sm ${isInactive ? "text-gray-500" : "text-gray-600"}`}>{account.number ? `****${account.number}` : t("withoutNumber")}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        account.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {account.isActive ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {/* Acciones primarias por fila: editar, toggle activo y eliminar. */}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(account)}
                        className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleActive(account)}
                        disabled={isMutatingRow}
                        className="px-3 py-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMutatingRow ? tAccountForm("pending") : account.isActive ? t("disable") : t("enable")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(account)}
                        className="px-3 py-1.5 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        {tCommon("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
