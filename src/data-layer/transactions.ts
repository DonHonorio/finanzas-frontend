import { ActionStateType } from "@/src/types/action-types"
import { getCategoryTransactions as getCategoryTransactionsBackend } from "@/src/actions/get-category-transactions-action"
import { getSubcategoryTransactions as getSubcategoryTransactionsBackend } from "@/src/actions/get-subcategory-transactions-action"
import createTransactionBackend from "@/src/actions/create-transaction-action"
import updateTransactionBackend from "@/src/actions/update-transaction-action"
import deleteTransactionBackend from "@/src/actions/delete-transaction-action"

type SessionType = "backend" | "local" | "none"

// Resuelve el origen de sesión para enrutar operaciones de transacciones.
async function resolveSessionType(): Promise<SessionType> {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("localToken") ? "local" : "backend"
  }

  const { getSessionType } = await import("./session")
  return getSessionType()
}

// Evita llamadas locales desde servidor (IndexedDB solo cliente).
function assertClientForLocalSession(sessionType: SessionType) {
  if (sessionType === "local" && typeof window === "undefined") {
    throw new Error("LOCAL_SESSION_REQUIRES_CLIENT")
  }
}

// Obtiene transacciones de una categoría según backend/local.
export async function getCategoryTransactions(categoryId: number) {
  const sessionType = await resolveSessionType()
  console.log('Resolved session type:', sessionType)

  if (sessionType === "backend") {
    return getCategoryTransactionsBackend(categoryId)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { getCategoryTransactions } = await import("@/src/indexdb/transactions")
    return getCategoryTransactions(categoryId)
  }

  throw new Error("SESSION_NONE")
}

// Obtiene transacciones de una subcategoría según backend/local.
export async function getSubcategoryTransactions(categoryId: number, subcategoryId: number) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    return getSubcategoryTransactionsBackend(categoryId, subcategoryId)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { getSubcategoryTransactions } = await import("@/src/indexdb/transactions")
    return getSubcategoryTransactions(categoryId, subcategoryId)
  }

  throw new Error("SESSION_NONE")
}

// Crea una transacción en el origen de sesión activo.
export async function createTransaction(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    return createTransactionBackend(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { default: createTransaction } = await import("@/src/indexdb/transactions")
    return createTransaction(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

// Actualiza una transacción en el origen de sesión activo.
export async function updateTransaction(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    return updateTransactionBackend(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { updateTransaction } = await import("@/src/indexdb/transactions")
    return updateTransaction(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

// Elimina una transacción en el origen de sesión activo.
export async function deleteTransaction(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    return deleteTransactionBackend(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { deleteTransaction } = await import("@/src/indexdb/transactions")
    return deleteTransaction(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}
