import { ActionStateType } from "@/src/types/action-types"
import { Transaction } from "@/src/types/transaction-types"
import { getDB } from "./db"
import { DraftTransactionSchema } from "@/src/schemas"

// Recupera transacciones locales de una categoría con comparación robusta de IDs.
export async function getCategoryTransactions(categoryId: number): Promise<Transaction[]> {
  const db = await getDB()
  const normalizedCategoryId = String(categoryId)

  const transactions = await new Promise<Transaction[]>((resolve, reject) => {
    const tx = db.transaction("transactions", "readonly")
    const store = tx.objectStore("transactions")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Transaction[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las transacciones"))
  })

  return transactions.filter((transaction) => String(transaction.categoryId) === normalizedCategoryId)
}

// Recupera transacciones locales de una subcategoría concreta.
export async function getSubcategoryTransactions(categoryId: number, subcategoryId: number): Promise<Transaction[]> {
  const db = await getDB()
  const normalizedCategoryId = String(categoryId)
  const normalizedSubcategoryId = Number(subcategoryId)

  const transactions = await new Promise<Transaction[]>((resolve, reject) => {
    const tx = db.transaction("transactions", "readonly")
    const store = tx.objectStore("transactions")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Transaction[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las transacciones"))
  })

  return transactions.filter(
    (transaction) =>
      String(transaction.categoryId) === normalizedCategoryId && Number(transaction.subcategoryId) === normalizedSubcategoryId
  )
}

// Crea transacción local validada.
export default async function createTransaction(prevState: ActionStateType, formData: FormData) {
  const transactionData = {
    name: formData.get("name"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    type: formData.get("type"),
    currency: formData.get("currency"),
    accountId: formData.get("account"),
    categoryId: formData.get("category"),
    subcategoryId: formData.get("subcategory") || null,
  }

  const transactionParsed = DraftTransactionSchema.safeParse(transactionData)
  if (!transactionParsed.success) {
    return {
      errors: transactionParsed.error._zod.def.map((issue) => issue.message),
      success: ""
    }
  }

  const parsedData = transactionParsed.data

  const transaction: Transaction = {
    transactionId: String(Date.now()),
    name: parsedData.name,
    date: parsedData.date,
    amount: Number(parsedData.amount),
    description: parsedData.description,
    type: parsedData.type,
    currency: parsedData.currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accountId: parsedData.accountId,
    categoryId: parsedData.categoryId,
    subcategoryId: parsedData.subcategoryId ? Number(parsedData.subcategoryId) : undefined
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite")
    const store = tx.objectStore("transactions")
    const request = store.add(transaction)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo crear la transacción"))
  })

  return {
    errors: [],
    success: "Transacción creada"
  }
}

// Actualiza una transacción local existente.
export async function updateTransaction(prevState: ActionStateType, formData: FormData) {
  const transactionId = formData.get("transactionId")

  if (!transactionId) {
    return {
      errors: ["ID de transacción no proporcionado."],
      success: ""
    }
  }

  const db = await getDB()

  const existingTransaction = await new Promise<Transaction | undefined>((resolve, reject) => {
    const tx = db.transaction("transactions", "readonly")
    const store = tx.objectStore("transactions")
    const request = store.get(String(transactionId))

    request.onsuccess = () => resolve(request.result as Transaction | undefined)
    request.onerror = () => reject(request.error ?? new Error("No se pudo leer la transacción"))
  })

  if (!existingTransaction) {
    return {
      errors: ["Transacción no encontrada."],
      success: ""
    }
  }

  const transactionData = {
    name: formData.get("name") ?? existingTransaction.name,
    type: formData.get("type") ?? existingTransaction.type,
    date: formData.get("date") ?? existingTransaction.date,
    amount: formData.get("amount") ?? String(existingTransaction.amount),
    currency: formData.get("currency") ?? existingTransaction.currency,
    description: formData.get("description") ?? existingTransaction.description,
    accountId: formData.get("account") ?? existingTransaction.accountId,
    categoryId: formData.get("category") ?? existingTransaction.categoryId,
    subcategoryId: formData.get("subcategory") ?? (existingTransaction.subcategoryId ? String(existingTransaction.subcategoryId) : null),
  }

  const transactionParsed = DraftTransactionSchema.safeParse(transactionData)
  if (!transactionParsed.success) {
    return {
      errors: transactionParsed.error._zod.def.map((issue) => issue.message),
      success: ""
    }
  }

  const parsedData = transactionParsed.data

  const updatedTransaction: Transaction = {
    ...existingTransaction,
    name: parsedData.name,
    type: parsedData.type,
    date: parsedData.date,
    amount: Number(parsedData.amount),
    currency: parsedData.currency,
    description: parsedData.description,
    accountId: parsedData.accountId,
    categoryId: parsedData.categoryId,
    subcategoryId: parsedData.subcategoryId ? Number(parsedData.subcategoryId) : undefined,
    updatedAt: new Date().toISOString()
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite")
    const store = tx.objectStore("transactions")
    const request = store.put(updatedTransaction)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo actualizar la transacción"))
  })

  return {
    errors: [],
    success: "Transacción actualizada"
  }
}

// Elimina una transacción local por ID.
export async function deleteTransaction(prevState: ActionStateType, formData: FormData) {
  const transactionId = formData.get("transactionId")

  if (!transactionId) {
    return {
      errors: ["ID de transacción no proporcionado."],
      success: ""
    }
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite")
    const store = tx.objectStore("transactions")
    const request = store.delete(String(transactionId))

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo eliminar la transacción"))
  })

  return {
    errors: [],
    success: "Transacción eliminada"
  }
}
