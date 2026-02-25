"use server"

import { getToken } from "@/src/auth/token"
import { UserSchema } from "@/src/schemas"

// Obtiene el usuario autenticado de backend y valida su forma con schema compartido.
export async function getUserAction() {
  // Si no hay token, se considera sesión no autenticada.
  const token = await getToken()
  if (!token) return null

  const url = `${process.env.API_URL}/auth/user`

  try {
    // `no-store` evita reutilizar datos stale de sesión en render server.
    const req = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    })

    if (!req.ok) return null

    const session = await req.json()
    const result = UserSchema.safeParse(session)

    // Si backend devuelve forma inesperada, se corta en null para mantener contrato seguro.
    if (!result.success) return null

    return result.data
  } catch {
    return null
  }
}
