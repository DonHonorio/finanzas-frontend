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
import { useTranslations } from "next-intl"

type User = z.infer<typeof UserSchema>

interface CuentasPageClientProps {
  user?: User | null
  source?: "backend" | "local" | "none"
}

// Página cliente de cuentas con tabla, modales CRUD y sincronización reactiva por SWR.
export function CuentasPageClient({ user, source }: CuentasPageClientProps) {
  const t = useTranslations("AccountsPage")
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

          toast.success(result.success || t("statusUpdated"))
          await mutate()
        } catch {
          toast.error(t("statusUpdateError"))
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

      toast.success(result.success || t("deleteSuccess"))
      setDeletingAccount(null)
      await mutate()
    } catch {
      toast.error(t("deleteError"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-gray-50">
      <Header user={resolvedUser} source={source} />

      <main className="flex-1 min-h-0 p-3 sm:p-6 md:p-10 overflow-hidden">
        <div className="h-full bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Cabecera de sección con CTA de creación. */}
          <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800">{t("title")}</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{t("subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenAddAccountModal(true)}
              className="shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              {t("add")}
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Estados de datos: loading, error, vacío o tabla con contenido. */}
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-500">{t("loading")}</div>
            ) : isError ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-destructive font-medium">{t("loadError")}</p>
                {process.env.NODE_ENV === "development" && error instanceof Error && (
                  <p className="text-xs text-gray-500">{error.message}</p>
                )}
                <button
                  type="button"
                  onClick={() => mutate()}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  {t("retry")}
                </button>
              </div>
            ) : accounts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
                <h2 className="text-xl font-semibold text-gray-800">{t("emptyTitle")}</h2>
                <p className="text-gray-500">{t("emptySubtitle")}</p>
                <button
                  type="button"
                  onClick={() => setOpenAddAccountModal(true)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  {t("create")}
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
