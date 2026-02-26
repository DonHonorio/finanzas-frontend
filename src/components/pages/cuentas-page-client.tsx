'use client'

import { useState, useTransition } from "react"
import { z } from "zod"
import { Header } from "@/src/components/menu-principal/header"
import ToastNotification from "@/src/components/ui/ToastNotification"
import { UserSchema } from "@/src/schemas"
import { useResolvedSessionUser } from "@/src/hooks/use-resolved-session-user"
import { useAccountsData } from "@/src/hooks/use-accounts-data"
import { Account } from "@/src/types/account-types"
import { AddAccountModal } from "@/src/components/cuentas/add-account-modal"
import { EditAccountModal } from "@/src/components/cuentas/edit-account-modal"
import { ConfirmDeleteAccountModal } from "@/src/components/cuentas/confirm-delete-account-modal"
import { AccountsTable } from "@/src/components/cuentas/accounts-table"
import { deleteAccount, toggleAccountActive } from "@/src/data-layer/accounts"
import { toast } from "react-toastify"

type User = z.infer<typeof UserSchema>

interface CuentasPageClientProps {
  user?: User | null
  source?: "backend" | "local" | "none"
}

export function CuentasPageClient({ user, source }: CuentasPageClientProps) {
  const resolvedUser = useResolvedSessionUser(user, source)
  const accountsUserCacheKey = `${source ?? "none"}:${resolvedUser?.userId ?? "anonymous"}`
  const { accounts, isLoading, isError, error, mutate } = useAccountsData(accountsUserCacheKey)

  const [openAddAccountModal, setOpenAddAccountModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mutatingAccountId, setMutatingAccountId] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  const handleAccountChanged = () => {
    void mutate()
  }

  const handleToggleActive = (account: Account) => {
    setMutatingAccountId(account.accountId)

    const formData = new FormData()
    formData.append("accountId", String(account.accountId))
    formData.append("newStatus", String(!account.isActive))

    startTransition(() => {
      void (async () => {
        try {
          const result = await toggleAccountActive({ errors: [], success: "" }, formData)

          if (result.errors.length > 0) {
            result.errors.forEach((message) => toast.error(message))
            return
          }

          toast.success(result.success || "Estado actualizado")
          await mutate()
        } catch {
          toast.error("No se pudo actualizar el estado de la cuenta.")
        } finally {
          setMutatingAccountId(null)
        }
      })()
    })
  }

  const handleDeleteConfirmed = async () => {
    if (!deletingAccount) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append("accountId", String(deletingAccount.accountId))

    try {
      const result = await deleteAccount({ errors: [], success: "" }, formData)

      if (result.errors.length > 0) {
        result.errors.forEach((message) => toast.error(message))
        return
      }

      toast.success(result.success || "Cuenta eliminada")
      setDeletingAccount(null)
      await mutate()
    } catch {
      toast.error("No se pudo eliminar la cuenta.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header user={resolvedUser} source={source} />

      <main className="flex-1 p-10 overflow-hidden">
        <div className="h-full bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Cuentas</h1>
              <p className="text-sm text-gray-500 mt-1">Crea, edita, elimina y administra el estado de tus cuentas.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenAddAccountModal(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              + Añadir cuenta
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-500">Cargando cuentas...</div>
            ) : isError ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-destructive font-medium">No se pudieron cargar las cuentas.</p>
                {process.env.NODE_ENV === "development" && error instanceof Error && (
                  <p className="text-xs text-gray-500">{error.message}</p>
                )}
                <button
                  type="button"
                  onClick={() => mutate()}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  Reintentar
                </button>
              </div>
            ) : accounts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
                <h2 className="text-xl font-semibold text-gray-800">No hay cuentas registradas</h2>
                <p className="text-gray-500">Crea tu primera cuenta para empezar a organizar tus movimientos.</p>
                <button
                  type="button"
                  onClick={() => setOpenAddAccountModal(true)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  Crear cuenta
                </button>
              </div>
            ) : (
              <AccountsTable
                accounts={accounts}
                mutatingAccountId={mutatingAccountId}
                onEdit={setEditingAccount}
                onToggleActive={handleToggleActive}
                onDelete={setDeletingAccount}
              />
            )}
          </div>
        </div>
      </main>

      <AddAccountModal
        open={openAddAccountModal}
        onCancel={() => setOpenAddAccountModal(false)}
        onAccept={() => {
          setOpenAddAccountModal(false)
          handleAccountChanged()
        }}
      />

      {editingAccount && (
        <EditAccountModal
          open={Boolean(editingAccount)}
          account={editingAccount}
          onCancel={() => setEditingAccount(null)}
          onAccept={() => {
            setEditingAccount(null)
            handleAccountChanged()
          }}
        />
      )}

      <ConfirmDeleteAccountModal
        isOpen={Boolean(deletingAccount)}
        accountName={deletingAccount?.name ?? ""}
        isDeleting={isDeleting}
        onClose={() => {
          if (isDeleting) return
          setDeletingAccount(null)
        }}
        onConfirm={handleDeleteConfirmed}
      />

      <ToastNotification />
    </div>
  )
}
