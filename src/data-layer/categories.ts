import { ActionStateType } from "@/src/types/action-types"

type SessionType = "backend" | "local" | "none"

// Resuelve el origen de sesión en cliente o servidor.
async function resolveSessionType(): Promise<SessionType> {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("localToken") ? "local" : "backend"
  }

  const { getSessionType } = await import("./session")
  return getSessionType()
}

// Evita acceder a IndexedDB desde entorno server.
function assertClientForLocalSession(sessionType: SessionType) {
  if (sessionType === "local" && typeof window === "undefined") {
    throw new Error("LOCAL_SESSION_REQUIRES_CLIENT")
  }
}

// Lectura de categorías en backend/local con contrato único.
export async function getCategories() {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { getCategories } = await import("@/src/actions/get-categories-action")
    return getCategories()
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { getCategories } = await import("@/src/indexdb/categories")
    return getCategories()
  }

  throw new Error("SESSION_NONE")
}

// Alta de categoría delegada al origen de sesión.
export async function createCategory(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: createCategory } = await import("@/src/actions/create-category-action")
    return createCategory(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { createCategory } = await import("@/src/indexdb/categories")
    return createCategory(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

// Edición de categoría delegada al origen de sesión.
export async function updateCategory(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: updateCategory } = await import("@/src/actions/update-category-action")
    return updateCategory(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { updateCategory } = await import("@/src/indexdb/categories")
    return updateCategory(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

// Eliminación de categoría delegada al origen de sesión.
export async function deleteCategory(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: deleteCategory } = await import("@/src/actions/delete-category-action")
    return deleteCategory(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { deleteCategory } = await import("@/src/indexdb/categories")
    return deleteCategory(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}
