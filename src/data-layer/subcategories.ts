import { ActionStateType } from "@/src/types/action-types"

type SessionType = "backend" | "local" | "none"

// Resuelve sesión para enrutar operaciones backend/local.
async function resolveSessionType(): Promise<SessionType> {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("localToken") ? "local" : "backend"
  }

  const { getSessionType } = await import("./session")
  return getSessionType()
}

// Bloquea acceso a IndexedDB en ejecución server.
function assertClientForLocalSession(sessionType: SessionType) {
  if (sessionType === "local" && typeof window === "undefined") {
    throw new Error("LOCAL_SESSION_REQUIRES_CLIENT")
  }
}

// Lectura de subcategorías por categoría según sesión.
export async function getSubcategories(categoryId: number) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { getSubcategories } = await import("@/src/actions/get-subcategories-action")
    return getSubcategories(categoryId)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { getSubcategories } = await import("@/src/indexdb/subcategories")
    return getSubcategories(categoryId)
  }

  throw new Error("SESSION_NONE")
}

// Alta de subcategoría según origen activo.
export async function createSubcategory(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: createSubcategory } = await import("@/src/actions/create-subcategory-action")
    return createSubcategory(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { createSubcategory } = await import("@/src/indexdb/subcategories")
    return createSubcategory(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

// Edición de subcategoría según origen activo.
export async function updateSubcategory(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: updateSubcategory } = await import("@/src/actions/update-subcategory-action")
    return updateSubcategory(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { updateSubcategory } = await import("@/src/indexdb/subcategories")
    return updateSubcategory(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

// Eliminación de subcategoría según origen activo.
export async function deleteSubcategory(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: deleteSubcategory } = await import("@/src/actions/delete-subcategory-action")
    return deleteSubcategory(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { deleteSubcategory } = await import("@/src/indexdb/subcategories")
    return deleteSubcategory(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}
