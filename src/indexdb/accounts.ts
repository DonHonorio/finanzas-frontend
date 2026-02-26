import { ActionStateType } from "@/src/types/action-types"
import { Account } from "@/src/types/account-types"
import { getDB } from "./db"
import { DraftAccountSchema } from "@/src/schemas"

// Obtiene cuentas locales y las ordena para mantener una presentación consistente en UI.
export async function getAccounts(): Promise<Account[]> {
  const db = await getDB()

  const accounts = await new Promise<Account[]>((resolve, reject) => {
    const tx = db.transaction("accounts", "readonly")
    const store = tx.objectStore("accounts")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Account[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las cuentas"))
  })

  // Orden principal por "order" y secundario por nombre para estabilidad visual.
  return accounts.sort((a, b) => {
    const orderA = Number(a.order ?? 0)
    const orderB = Number(b.order ?? 0)

    if (orderA !== orderB) return orderA - orderB
    return a.name.localeCompare(b.name)
  })
}

// Lee una cuenta puntual para operaciones de update/toggle sin traer toda la colección.
async function getAccountById(accountId: number): Promise<Account | undefined> {
  const db = await getDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction("accounts", "readonly")
    const store = tx.objectStore("accounts")
    const request = store.get(accountId)

    request.onsuccess = () => resolve(request.result as Account | undefined)
    request.onerror = () => reject(request.error ?? new Error("No se pudo leer la cuenta"))
  })
}

// Crea cuenta local aplicando mismas validaciones del flujo backend.
export async function createAccount(prevState: ActionStateType, formData: FormData) {
  // Calcula siguiente orden por defecto para ubicar la cuenta al final.
  const existingAccounts = await getAccounts()
  const maxOrder = existingAccounts.reduce((max, account) => Math.max(max, Number(account.order ?? 0)), 0)

  const accountData = {
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance"),
    currency: formData.get("currency"),
    number: formData.get("number"),
    order: formData.get("order") ?? String(maxOrder + 1),
    isActive: String(formData.get("isActive") ?? "true") === "true",
    bankId: formData.get("bankId") ?? "1",
  }

  // Valida/normaliza payload con schema compartido.
  const accountParsed = DraftAccountSchema.safeParse(accountData)
  if (!accountParsed.success) {
    return {
      errors: accountParsed.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  const parsedData = accountParsed.data
  const now = new Date().toISOString()

  // Construye entidad final incluyendo metadatos usados por la app.
  const account: Account = {
    accountId: Date.now(),
    name: parsedData.name,
    type: parsedData.type as Account["type"],
    balance: parsedData.balance,
    currency: parsedData.currency,
    number: parsedData.number,
    order: parsedData.order ?? maxOrder + 1,
    isActive: parsedData.isActive,
    createdAt: now,
    updatedAt: now,
    userId: 0,
    bankId: parsedData.bankId,
  }

  const db = await getDB()

  // Persiste la cuenta en el objectStore "accounts".
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("accounts", "readwrite")
    const store = tx.objectStore("accounts")
    const request = store.add(account)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo crear la cuenta"))
  })

  return {
    errors: [],
    success: "Cuenta creada",
  }
}

// Actualiza una cuenta local respetando los campos previos no enviados.
export async function updateAccount(prevState: ActionStateType, formData: FormData) {
  const accountId = Number(formData.get("accountId"))

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  // Recupera estado actual para merge de datos y validación completa posterior.
  const existingAccount = await getAccountById(accountId)

  if (!existingAccount) {
    return {
      errors: ["Cuenta no encontrada."],
      success: "",
    }
  }

  // Combina nuevos valores con los existentes para permitir ediciones parciales.
  const accountData = {
    name: formData.get("name") ?? existingAccount.name,
    type: formData.get("type") ?? existingAccount.type,
    balance: formData.get("balance") ?? existingAccount.balance,
    currency: formData.get("currency") ?? existingAccount.currency,
    number: formData.get("number") ?? existingAccount.number,
    order: formData.get("order") ?? String(existingAccount.order ?? 0),
    isActive: String(formData.get("isActive") ?? String(existingAccount.isActive)) === "true",
    bankId: formData.get("bankId") ?? String(existingAccount.bankId ?? 1),
  }

  // Revalida el payload combinado antes de persistir.
  const accountParsed = DraftAccountSchema.safeParse(accountData)
  if (!accountParsed.success) {
    return {
      errors: accountParsed.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  const parsedData = accountParsed.data

  // Aplica cambios y renueva updatedAt para trazabilidad.
  const updatedAccount: Account = {
    ...existingAccount,
    name: parsedData.name,
    type: parsedData.type as Account["type"],
    balance: parsedData.balance,
    currency: parsedData.currency,
    number: parsedData.number,
    order: parsedData.order ?? existingAccount.order,
    isActive: parsedData.isActive,
    bankId: parsedData.bankId,
    updatedAt: new Date().toISOString(),
  }

  const db = await getDB()

  // Sobrescribe la cuenta existente por clave primaria.
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("accounts", "readwrite")
    const store = tx.objectStore("accounts")
    const request = store.put(updatedAccount)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo actualizar la cuenta"))
  })

  return {
    errors: [],
    success: "Cuenta actualizada",
  }
}

// Elimina cuenta local y limpia transacciones asociadas para evitar datos huérfanos.
export async function deleteAccount(prevState: ActionStateType, formData: FormData) {
  const accountId = Number(formData.get("accountId"))

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  const db = await getDB()

  // Detecta transacciones ligadas a la cuenta antes del borrado.
  const transactions = await new Promise<Array<{ transactionId: string; accountId: string | number }>>((resolve, reject) => {
    const tx = db.transaction("transactions", "readonly")
    const store = tx.objectStore("transactions")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Array<{ transactionId: string; accountId: string | number }>)
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las transacciones asociadas"))
  })

  // Borra la cuenta del store principal.
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("accounts", "readwrite")
    const store = tx.objectStore("accounts")
    const request = store.delete(accountId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo eliminar la cuenta"))
  })

  const linkedTransactions = transactions.filter((item) => String(item.accountId) === String(accountId))

  // Borra movimientos vinculados para mantener integridad referencial local.
  if (linkedTransactions.length > 0) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("transactions", "readwrite")
      const store = tx.objectStore("transactions")

      linkedTransactions.forEach((item) => {
        store.delete(item.transactionId)
      })

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error("No se pudieron eliminar transacciones de la cuenta"))
    })
  }

  return {
    errors: [],
    success: "Cuenta eliminada",
  }
}

// Activa/desactiva cuenta local, aceptando también fallback por inversión del estado actual.
export async function toggleAccountActive(prevState: ActionStateType, formData: FormData) {
  const accountId = Number(formData.get("accountId"))

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  const account = await getAccountById(accountId)

  if (!account) {
    return {
      errors: ["Cuenta no encontrada."],
      success: "",
    }
  }

  // Soporta modo explícito (newStatus) o modo toggle implícito.
  const newStatusRaw = formData.get("newStatus")
  const newStatus =
    newStatusRaw === "true"
      ? true
      : newStatusRaw === "false"
        ? false
        : !account.isActive

  const db = await getDB()

  // Persiste únicamente el cambio de estado más actualización de timestamp.
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("accounts", "readwrite")
    const store = tx.objectStore("accounts")
    const request = store.put({
      ...account,
      isActive: newStatus,
      updatedAt: new Date().toISOString(),
    } satisfies Account)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo actualizar el estado de la cuenta"))
  })

  return {
    errors: [],
    success: `Cuenta ${newStatus ? "habilitada" : "deshabilitada"}`,
  }
}
