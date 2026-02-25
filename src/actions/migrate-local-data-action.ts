'use server'

import { getToken } from '@/src/auth/token'
import { AccountType } from '@/src/types/account-types'

// Tipos del payload de migración enviados desde cliente local.
type LocalAccountPayload = {
  accountId: number
  name: string
  type: string
  balance: string | number
  currency: string
  number?: string | null
  bankId?: number | null
}

type LocalCategoryPayload = {
  categoryId: number
  name: string
  budget: string | number
  frequency: string
  dtstart: string
  icon?: string | null
  type: 'income' | 'expense'
  color?: string | null
  isActive: boolean
  withSubcategory: boolean
}

type LocalSubcategoryPayload = {
  subcategoryId: number
  categoryId: number
  name: string
  description?: string | null
  budget: string | number
  color?: string | null
  isActive: boolean
}

type LocalTransactionPayload = {
  transactionId: string
  name: string
  date: string
  amount: string | number
  description?: string | null
  type: 'income' | 'expense'
  currency: string
  accountId: string | number
  categoryId: string | number
  subcategoryId?: number | null
}

type MigrationPayload = {
  accounts: LocalAccountPayload[]
  categories: LocalCategoryPayload[]
  subcategories: LocalSubcategoryPayload[]
  transactions: LocalTransactionPayload[]
}

type MigrationResult = {
  success: boolean
  message: string
  summary: {
    accountsCreated: number
    categoriesCreated: number
    subcategoriesCreated: number
    transactionsCreated: number
  }
  errors: string[]
}

// Normaliza tipos de cuenta locales al enum esperado por backend.
function normalizeAccountType(type: string): string {
  if (type in AccountType) {
    return AccountType[type as keyof typeof AccountType]
  }

  return type
}

// Migra datos locales en orden dependiente: cuentas -> categorías -> subcategorías -> transacciones.
export async function migrateLocalDataAction(payload: MigrationPayload): Promise<MigrationResult> {
  // La migración requiere sesión backend activa.
  const token = await getToken()
  if (!token) {
    return {
      success: false,
      message: 'No autenticado. Inicia sesión en backend para migrar datos.',
      summary: {
        accountsCreated: 0,
        categoriesCreated: 0,
        subcategoriesCreated: 0,
        transactionsCreated: 0
      },
      errors: ['TOKEN_MISSING']
    }
  }

  const apiUrl = process.env.API_URL
  if (!apiUrl) {
    return {
      success: false,
      message: 'API_URL no configurada.',
      summary: {
        accountsCreated: 0,
        categoriesCreated: 0,
        subcategoriesCreated: 0,
        transactionsCreated: 0
      },
      errors: ['API_URL_MISSING']
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  const errors: string[] = []
  const accountIdMap = new Map<string, number>()
  const categoryIdMap = new Map<string, number>()
  const subcategoryIdMap = new Map<string, number>()

  let accountsCreated = 0
  let categoriesCreated = 0
  let subcategoriesCreated = 0
  let transactionsCreated = 0

  // 1) Crear cuentas y guardar mapa local->backend para referencias posteriores.
  for (const account of payload.accounts) {
    try {
      const req = await fetch(`${apiUrl}/accounts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: account.name,
          type: normalizeAccountType(String(account.type)),
          balance: String(account.balance ?? '0'),
          currency: String(account.currency),
          number: account.number ? String(account.number) : null,
          bankId: Number(account.bankId) > 0 ? Number(account.bankId) : 1
        })
      })

      const json = await req.json()
      if (!req.ok) {
        errors.push(`Cuenta (${account.name}): ${json?.error ?? 'Error desconocido'}`)
        continue
      }

      const backendAccountId = Number(json?.account?.accountId)
      if (!backendAccountId) {
        errors.push(`Cuenta (${account.name}): no se recibió accountId en la respuesta`)
        continue
      }

      accountIdMap.set(String(account.accountId), backendAccountId)
      accountsCreated += 1
    } catch {
      errors.push(`Cuenta (${account.name}): fallo de conexión`)
    }
  }

  // 2) Crear categorías y mapear IDs para subcategorías y transacciones.
  for (const category of payload.categories) {
    try {
      const req = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: category.name,
          budget: String(category.budget),
          frequency: category.frequency,
          dtstart: category.dtstart,
          type: category.type,
          icon: category.icon ?? null,
          color: category.color ?? null,
          isActive: Boolean(category.isActive),
          withSubcategory: Boolean(category.withSubcategory)
        })
      })

      const json = await req.json()
      if (!req.ok) {
        errors.push(`Categoría (${category.name}): ${json?.error ?? 'Error desconocido'}`)
        continue
      }

      const backendCategoryId = Number(json?.category?.categoryId)
      if (!backendCategoryId) {
        errors.push(`Categoría (${category.name}): no se recibió categoryId en la respuesta`)
        continue
      }

      categoryIdMap.set(String(category.categoryId), backendCategoryId)
      categoriesCreated += 1
    } catch {
      errors.push(`Categoría (${category.name}): fallo de conexión`)
    }
  }

  // 3) Crear subcategorías solo si su categoría padre ya fue migrada.
  for (const subcategory of payload.subcategories) {
    const backendCategoryId = categoryIdMap.get(String(subcategory.categoryId))

    if (!backendCategoryId) {
      errors.push(`Subcategoría (${subcategory.name}): categoría padre no migrada`)
      continue
    }

    try {
      const req = await fetch(`${apiUrl}/categories/${backendCategoryId}/subcategories`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: subcategory.name,
          description: subcategory.description ?? null,
          budget: String(subcategory.budget),
          color: subcategory.color ?? null,
          isActive: Boolean(subcategory.isActive)
        })
      })

      const json = await req.json()
      if (!req.ok) {
        errors.push(`Subcategoría (${subcategory.name}): ${json?.error ?? 'Error desconocido'}`)
        continue
      }

      const backendSubcategoryId = Number(json?.subcategory?.subcategoryId)
      if (!backendSubcategoryId) {
        errors.push(`Subcategoría (${subcategory.name}): no se recibió subcategoryId en la respuesta`)
        continue
      }

      subcategoryIdMap.set(`${subcategory.categoryId}:${subcategory.subcategoryId}`, backendSubcategoryId)
      subcategoriesCreated += 1
    } catch {
      errors.push(`Subcategoría (${subcategory.name}): fallo de conexión`)
    }
  }

  // 4) Crear transacciones con IDs ya traducidos a backend.
  for (const transaction of payload.transactions) {
    const backendCategoryId = categoryIdMap.get(String(transaction.categoryId))
    const backendAccountId = accountIdMap.get(String(transaction.accountId))

    if (!backendCategoryId) {
      errors.push(`Transacción (${transaction.name}): categoría no migrada`)
      continue
    }

    if (!backendAccountId) {
      errors.push(`Transacción (${transaction.name}): cuenta no migrada`)
      continue
    }

    const localSubcategoryId = transaction.subcategoryId ? Number(transaction.subcategoryId) : null
    const backendSubcategoryId = localSubcategoryId
      ? subcategoryIdMap.get(`${transaction.categoryId}:${localSubcategoryId}`)
      : undefined

    try {
      const req = await fetch(`${apiUrl}/categories/${backendCategoryId}/transactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: transaction.name,
          date: transaction.date,
          amount: String(Math.abs(Number(transaction.amount) || 0)),
          description: transaction.description ?? null,
          type: transaction.type,
          currency: transaction.currency,
          accountId: backendAccountId,
          subcategoryId: backendSubcategoryId ?? null
        })
      })

      const json = await req.json()
      if (!req.ok) {
        errors.push(`Transacción (${transaction.name}): ${json?.error ?? 'Error desconocido'}`)
        continue
      }

      transactionsCreated += 1
    } catch {
      errors.push(`Transacción (${transaction.name}): fallo de conexión`)
    }
  }

  const success = errors.length === 0

  // Resultado agregado con métricas y detalle de incidencias.
  return {
    success,
    message: success
      ? 'Datos locales migrados correctamente a backend.'
      : 'Migración completada con incidencias. Revisa el detalle.',
    summary: {
      accountsCreated,
      categoriesCreated,
      subcategoriesCreated,
      transactionsCreated
    },
    errors
  }
}
