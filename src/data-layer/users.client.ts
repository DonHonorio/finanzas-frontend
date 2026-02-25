"use client"

import { getUserAction as getUserLocal } from "@/src/indexdb/users"
import { UserSchema } from "@/src/schemas"

// Lee usuario local y lo adapta al shape de usuario backend para reutilizar UI común.
export async function getLocalUser() {
  const localUser = await getUserLocal()

  if (!localUser || "error" in localUser) return null

  const normalizedUser = {
    userId: localUser.userId,
    email: "local@finanzas.app",
    name: "Usuario",
    fullName: "Usuario Local",
    avatar: null,
    baseCurrency: localUser.baseCurrency,
    timeZone: localUser.timeZone,
    isActive: true
  }

  // Valida la normalización para no propagar datos locales inválidos.
  const parsed = UserSchema.safeParse(normalizedUser)
  if (!parsed.success) return null

  return parsed.data
}
