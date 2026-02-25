import { CategoryRow } from "@/src/types/dashboard-types"
import { Category } from "@/src/types/category-types"
import { Transaction } from "@/src/types/transaction-types"
import { getDB } from "./db"
import { months } from "@/src/lib/utils"

// Construye filas de dashboard (por categoría/mes) a partir de datos locales.
export async function getDashboardData(type: "expenses" | "incomes", year: number): Promise<CategoryRow[]> {
  const db = await getDB()

  const [categories, transactions] = await Promise.all([
    new Promise<Category[]>((resolve, reject) => {
      const tx = db.transaction("categories", "readonly")
      const store = tx.objectStore("categories")
      const request = store.getAll()

      request.onsuccess = () => resolve((request.result ?? []) as Category[])
      request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las categorías"))
    }),
    new Promise<Transaction[]>((resolve, reject) => {
      const tx = db.transaction("transactions", "readonly")
      const store = tx.objectStore("transactions")
      const request = store.getAll()

      request.onsuccess = () => resolve((request.result ?? []) as Transaction[])
      request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las transacciones"))
    })
  ])

  const normalizedType = type === "expenses" ? "expense" : "income"

  // Inicializa estructura mensual por categoría del tipo solicitado.
  const rows: CategoryRow[] = categories
    .filter((category) => category.type === normalizedType)
    .map((category) => ({
      categoryId: Number(category.categoryId),
      name: category.name,
      budget: Number(category.budget),
      frequency: category.frequency,
      type: category.type,
      dtstart: category.dtstart,
      icon: category.icon,
      color: category.color,
      order: category.order,
      isActive: category.isActive,
      withSubcategory: category.withSubcategory,
      months: {
        enero: 0,
        febrero: 0,
        marzo: 0,
        abril: 0,
        mayo: 0,
        junio: 0,
        julio: 0,
        agosto: 0,
        septiembre: 0,
        octubre: 0,
        noviembre: 0,
        diciembre: 0,
      }
    }))

  const rowByCategoryId = new Map<number, CategoryRow>()
  rows.forEach((row) => rowByCategoryId.set(row.categoryId, row))

  // Acumula importes por mes filtrando por año y tipo.
  transactions.forEach((transaction) => {
    if (transaction.type !== normalizedType) return

    const categoryId = Number(transaction.categoryId)
    const row = rowByCategoryId.get(categoryId)
    if (!row) return

    const date = new Date(transaction.date)
    if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) return

    const monthName = months[date.getMonth()]
    row.months[monthName] += Number(transaction.amount) || 0
  })

  return rows.sort((a, b) => a.order - b.order)
}
