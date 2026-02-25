"use server"

import { getToken } from "@/src/auth/token"
import { CategoryRow } from "@/src/types/dashboard-types"

// Recupera filas del dashboard desde backend y normaliza posibles formatos de respuesta.
export async function getDashboardAction(type: "expenses" | "incomes", year: number): Promise<CategoryRow[]> {
  // Requiere sesión backend activa.
  const token = await getToken()

  if (!token) {
    throw new Error("No autenticado. Por favor, inicia sesión.")
  }

  const url = `${process.env.API_URL}/categories/dashboard/?type=${type}&year=${year}`

  // Petición autenticada al endpoint de dashboard.
  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const json = await req.json()

  if (!req.ok) {
    throw new Error(json?.error ?? "Error obteniendo dashboard")
  }

  // Compatibilidad con respuestas en array directo o envoltura { rows } / { data }.
  if (Array.isArray(json)) return json as CategoryRow[]
  if (Array.isArray(json?.rows)) return json.rows as CategoryRow[]
  if (Array.isArray(json?.data)) return json.data as CategoryRow[]

  return []
}
