import { ActionStateType } from "@/src/types/action-types"
import { getDB } from "./db"
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from "@/src/i18n/config"

type LocalUser = {
  userId: number
  baseCurrency: string
  timeZone: string
  createdAt: string
  updateAt: string
}

// Mantiene cookie de idioma en cliente para que SSR/CSR compartan el mismo locale.
function persistLocaleCookieClient(rawLocale: FormDataEntryValue | null | undefined) {
  if (typeof window === "undefined") return
  const localeValue = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(localeValue)}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
}

// Helpers de acceso base para leer/escribir usuario local.
async function getAllUsers(): Promise<LocalUser[]> {
  const db = await getDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction("users", "readonly")
    const store = tx.objectStore("users")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as LocalUser[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener los usuarios"))
  })
}

async function putUser(user: LocalUser): Promise<void> {
  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("users", "readwrite")
    const store = tx.objectStore("users")
    const request = store.put(user)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo guardar el usuario"))
  })
}

// Modelo local simplificado: se usa el primer registro como usuario actual.
async function getCurrentUser(): Promise<LocalUser | null> {
  const users = await getAllUsers()
  return users[0] ?? null
}

// /auth/create-account
export const createAccountAction = async (prevState: unknown, formData: FormData) => {
  // Crea (o reutiliza) perfil local mínimo para habilitar sesión offline.
  const baseCurrency = formData.get("baseCurrency")
  const timeZone = formData.get("timeZone")

  if (!baseCurrency || !timeZone) {
    return {
      success: false,
      message: "Error de validación",
      errors: {
        baseCurrency: !baseCurrency ? ["La moneda base es obligatoria"] : undefined,
        timeZone: !timeZone ? ["La zona horaria es obligatoria"] : undefined
      }
    }
  }

  const existingUser = await getCurrentUser()
  const userId = existingUser?.userId ?? Date.now()
  const now = new Date().toISOString()

  await putUser({
    userId,
    baseCurrency: String(baseCurrency),
    timeZone: String(timeZone),
    createdAt: existingUser?.createdAt ?? now,
    updateAt: now
  })

  persistLocaleCookieClient(formData.get("language"))

  return {
    success: true,
    message: "Cuenta creada exitosamente",
    userId
  }
}

// /auth/login
export const loginAction = async (prevState: unknown, formData: FormData) => {
  // Simula login local estableciendo token en localStorage.
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      message: "No existe cuenta local"
    }
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem("localToken", crypto.randomUUID())
  }

  return {
    success: true,
    message: "Inicio de sesión exitoso"
  }
}

// /auth/update-password
export default async function updatePassword(prevState: ActionStateType, formData: FormData) {
  return {
    errors: ["Operación no disponible en modo local"],
    success: ""
  }
}

// /auth/update-account
export async function updateUser(prevState: ActionStateType, formData: FormData) {
  // Permite editar solo preferencias locales soportadas por este modo.
  const user = await getCurrentUser()
  if (!user) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: ""
    }
  }

  const updatedUser: LocalUser = {
    ...user,
    baseCurrency: String(formData.get("baseCurrency") ?? user.baseCurrency),
    timeZone: String(formData.get("timeZone") ?? user.timeZone),
    updateAt: new Date().toISOString()
  }

  await putUser(updatedUser)
  persistLocaleCookieClient(formData.get("language"))

  return {
    errors: [],
    success: "Usuario actualizado"
  }
}

// /auth/delete-account
export async function deleteUser(prevState: ActionStateType, formData: FormData) {
  // Elimina perfil local y limpia token de sesión local en navegador.
  const user = await getCurrentUser()
  if (!user) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: ""
    }
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("users", "readwrite")
    const store = tx.objectStore("users")
    const request = store.delete(user.userId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo eliminar el usuario"))
  })

  if (typeof window !== "undefined") {
    window.localStorage.removeItem("localToken")
  }

  return {
    errors: [],
    success: "Cuenta eliminada"
  }
}

// /auth/user
export async function getUserAction() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "No autenticado"
    }
  }

  return user
}

// /auth/users/1
export async function getUserByIdAction(userId: number) {
  const users = await getAllUsers()
  const user = users.find((item) => item.userId === userId)

  if (!user) {
    return {
      error: "Usuario no encontrado"
    }
  }

  return user
}
