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

// Página cliente de cuentas con tabla, modales CRUD y sincronización reactiva por SWR.
export function CuentasPageClient({ user, source }: CuentasPageClientProps) {
  // Resuelve perfil efectivo para soportar sesión backend y local con mismo layout.
  const resolvedUser = useResolvedSessionUser(user, source)
  // Segmenta caché por usuario/origen para evitar cruces entre sesiones.
  const accountsUserCacheKey = `${source ?? "none"}:${resolvedUser?.userId ?? "anonymous"}`
  const { accounts, isLoading, isError, error, mutate } = useAccountsData(accountsUserCacheKey)

  // Estado UI de modales y feedback de operaciones por fila.
  const [openAddAccountModal, setOpenAddAccountModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mutatingAccountId, setMutatingAccountId] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  // Revalida la lista tras cualquier mutación exitosa.
  const handleAccountChanged = () => {
    void mutate()
  }

  // Alterna estado activo/deshabilitado y refresca lista conservando UI fluida.
  const handleToggleActive = (account: Account) => {
    setMutatingAccountId(account.accountId)

    const formData = new FormData()
    formData.append("accountId", String(account.accountId))
    formData.append("newStatus", String(!account.isActive))

    startTransition(() => {
      // Ejecuta mutación asíncrona con manejo de éxito/error por toast.
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

    // Ejecuta borrado confirmado por el modal y refresca datos al finalizar.
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
          {/* Cabecera de sección con CTA de creación. */}
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
            {/* Estados de datos: loading, error, vacío o tabla con contenido. */}
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
              // Tabla principal de cuentas y acciones por fila.
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
        // Muestra edición solo cuando hay una cuenta seleccionada.
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
          // Impide cerrar el modal mientras el delete está en progreso.
          if (isDeleting) return
          setDeletingAccount(null)
        }}
        onConfirm={handleDeleteConfirmed}
      />

      <ToastNotification />
    </div>
  )
}
