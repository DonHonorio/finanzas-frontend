'use client'

import { Account, AccountType } from "@/src/types/account-types"

type Props = {
  accounts: Account[]
  mutatingAccountId: number | null
  onEdit: (account: Account) => void
  onToggleActive: (account: Account) => void
  onDelete: (account: Account) => void
}

// Traduce type al label visible incluso si el dato viene como key enum.
function getTypeLabel(type: Account["type"]) {
  const value = String(type)
  return value in AccountType ? AccountType[value as keyof typeof AccountType] : value
}

// Formatea saldo en la moneda de la propia cuenta para coherencia visual.
function formatBalance(balance: string, currency: string) {
  const amount = Number(balance)
  if (Number.isNaN(amount)) return `${balance} ${currency}`

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount)
}

export function AccountsTable({ accounts, mutatingAccountId, onEdit, onToggleActive, onDelete }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px]">
        {/* Cabecera con columnas base de gestión de cuentas. */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Nombre</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Moneda</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Saldo</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Núm.</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            // Bloquea solo la fila en curso para no congelar toda la tabla durante un toggle.
            const isMutatingRow = mutatingAccountId === account.accountId
            return (
              <tr key={account.accountId} className="border-b border-gray-100 hover:bg-gray-50/70">
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{account.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{getTypeLabel(account.type)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.currency}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">{formatBalance(account.balance, account.currency)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.number ? `****${account.number}` : "Sin número"}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      account.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {account.isActive ? "Activa" : "Deshabilitada"}
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
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleActive(account)}
                      disabled={isMutatingRow}
                      className="px-3 py-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isMutatingRow ? "Guardando..." : account.isActive ? "Deshabilitar" : "Habilitar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(account)}
                      className="px-3 py-1.5 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
