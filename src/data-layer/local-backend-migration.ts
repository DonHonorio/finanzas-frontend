"use client"

import { migrateLocalDataAction } from "@/src/actions/migrate-local-data-action"
import { getAccounts as getLocalAccounts } from "@/src/indexdb/accounts"
import { getCategories as getLocalCategories } from "@/src/indexdb/categories"
import { getSubcategories as getLocalSubcategories } from "@/src/indexdb/subcategories"
import { getCategoryTransactions as getLocalCategoryTransactions } from "@/src/indexdb/transactions"

// Orquesta la recolección local y delega el envío consolidado al server action de migración.
export async function syncLocalDataToBackend() {
  // Carga base paralela de cuentas/categorías locales.
  const [accounts, categories] = await Promise.all([
    getLocalAccounts(),
    getLocalCategories()
  ])

  const subcategories = [] as Awaited<ReturnType<typeof getLocalSubcategories>>
  const transactionsById = new Map<string, Awaited<ReturnType<typeof getLocalCategoryTransactions>>[number]>()

  // Recorre cada categoría para extraer subcategorías y transacciones relacionadas.
  for (const category of categories) {
    const [categorySubcategories, categoryTransactions] = await Promise.all([
      getLocalSubcategories(Number(category.categoryId)),
      getLocalCategoryTransactions(Number(category.categoryId))
    ])

    subcategories.push(...categorySubcategories)

    for (const transaction of categoryTransactions) {
      // Dedupe por ID para evitar repetir transacciones en payload final.
      transactionsById.set(String(transaction.transactionId), transaction)
    }
  }

  // Envía payload completo al server action, manteniendo separación cliente/servidor.
  return migrateLocalDataAction({
    accounts: accounts.map((account) => ({
      accountId: account.accountId,
      name: account.name,
      type: String(account.type),
      balance: account.balance,
      currency: account.currency,
      number: account.number ?? null,
      bankId: account.bankId ?? 1
    })),
    categories: categories.map((category) => ({
      categoryId: category.categoryId,
      name: category.name,
      budget: category.budget,
      frequency: category.frequency,
      dtstart: category.dtstart,
      icon: category.icon,
      type: category.type,
      color: category.color,
      isActive: category.isActive,
      withSubcategory: category.withSubcategory
    })),
    subcategories: subcategories.map((subcategory) => ({
      subcategoryId: subcategory.subcategoryId,
      categoryId: subcategory.categoryId,
      name: subcategory.name,
      description: subcategory.description ?? null,
      budget: subcategory.budget,
      color: subcategory.color ?? null,
      isActive: subcategory.isActive
    })),
    transactions: Array.from(transactionsById.values()).map((transaction) => ({
      transactionId: transaction.transactionId,
      name: transaction.name,
      date: transaction.date,
      amount: transaction.amount,
      description: transaction.description ?? null,
      type: transaction.type,
      currency: transaction.currency,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      subcategoryId: transaction.subcategoryId ?? null
    }))
  })
}
