import { Account } from "@/src/types/account-types"
import { getDB } from "./db"

// Lee todas las cuentas almacenadas en IndexedDB local.
export async function getAccounts(): Promise<Account[]> {
  const db = await getDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction("accounts", "readonly")
    const store = tx.objectStore("accounts")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Account[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las cuentas"))
  })
}
