const DB_NAME = "finanzas_personales_local"
const DB_VERSION = 1
import { seedInitialData } from "./seed"

let dbPromise: Promise<IDBDatabase> | null = null

// Inicializa IndexedDB local y crea stores necesarios en primera apertura.
export function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = request.result
      const isNewDatabase = event.oldVersion === 0

      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "userId" })
      }

      if (!db.objectStoreNames.contains("accounts")) {
        const store = db.createObjectStore("accounts", { keyPath: "accountId" })
        store.createIndex("userId", "userId", { unique: false })
      }

      if (!db.objectStoreNames.contains("categories")) {
        const store = db.createObjectStore("categories", { keyPath: "categoryId" })
        store.createIndex("userId", "userId", { unique: false })
      }

      if (!db.objectStoreNames.contains("transactions")) {
        const store = db.createObjectStore("transactions", { keyPath: "transactionId" })
        store.createIndex("categoryId", "categoryId", { unique: false })
        store.createIndex("subcategoryId", "subcategoryId", { unique: false })
      }

      if (!db.objectStoreNames.contains("subcategories")) {
        const store = db.createObjectStore("subcategories", { keyPath: "subcategoryId" })
        store.createIndex("categoryId", "categoryId", { unique: false })
      }

      if (!db.objectStoreNames.contains("dashboard")) {
        db.createObjectStore("dashboard", { keyPath: "key" })
      }

      // Seed inicial solo en base nueva para no sobrescribir datos de usuarios existentes.
      if (isNewDatabase && request.transaction) {
        seedInitialData(request.transaction)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir IndexedDB"))
  })

  return dbPromise
}
