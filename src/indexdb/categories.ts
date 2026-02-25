import { ActionStateType } from "@/src/types/action-types"
import { Category } from "@/src/types/category-types"
import { getDB } from "./db"
import { DraftCategorySchema } from "@/src/schemas"

// Devuelve categorías locales persistidas en IndexedDB.
export async function getCategories(): Promise<Category[]> {
  const db = await getDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction("categories", "readonly")
    const store = tx.objectStore("categories")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Category[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las categorías"))
  })
}

// Crea una categoría local validando el payload con schema compartido.
export async function createCategory(prevState: ActionStateType, formData: FormData) {
  const categoryData = {
    name: formData.get("name"),
    budget: formData.get("budget"),
    frequency: formData.get("frequency"),
    dtstart: formData.get("dtstart"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
    withSubcategory: formData.get("withSubcategory") === "true",
  }

  const categoryParsed = DraftCategorySchema.safeParse(categoryData)
  if (!categoryParsed.success) {
    return {
      errors: categoryParsed.error._zod.def.map((issue) => issue.message),
      success: ""
    }
  }

  const parsedData = categoryParsed.data

  const category: Category = {
    categoryId: Date.now(),
    name: parsedData.name,
    budget: parsedData.budget,
    frequency: parsedData.frequency,
    dtstart: parsedData.dtstart,
    icon: parsedData.icon ?? "",
    type: parsedData.type,
    color: parsedData.color ?? "",
    order: parsedData.order ?? 0,
    isActive: parsedData.isActive,
    withSubcategory: parsedData.withSubcategory,
    userId: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("categories", "readwrite")
    const store = tx.objectStore("categories")
    const request = store.add(category)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo crear la categoría"))
  })

  return {
    errors: [],
    success: "Categoría creada"
  }
}

// Actualiza categoría local existente con fallback a valores previos.
export async function updateCategory(prevState: ActionStateType, formData: FormData) {
  const categoryId = Number(formData.get("categoryId"))

  if (!categoryId) {
    return {
      errors: ["ID de categoría no proporcionado."],
      success: ""
    }
  }

  const db = await getDB()

  const existingCategory = await new Promise<Category | undefined>((resolve, reject) => {
    const tx = db.transaction("categories", "readonly")
    const store = tx.objectStore("categories")
    const request = store.get(categoryId)

    request.onsuccess = () => resolve(request.result as Category | undefined)
    request.onerror = () => reject(request.error ?? new Error("No se pudo leer la categoría"))
  })

  if (!existingCategory) {
    return {
      errors: ["Categoría no encontrada."],
      success: ""
    }
  }

  const categoryData = {
    name: formData.get("name") ?? existingCategory.name,
    budget: formData.get("budget") ?? existingCategory.budget,
    frequency: formData.get("frequency") ?? existingCategory.frequency,
    dtstart: formData.get("dtstart") ?? existingCategory.dtstart,
    type: formData.get("type") ?? existingCategory.type,
    icon: formData.get("icon") ?? existingCategory.icon,
    color: formData.get("color") ?? existingCategory.color,
    order: formData.get("order") ?? existingCategory.order,
    isActive: String(formData.get("isActive") ?? String(existingCategory.isActive)) === "true",
    withSubcategory: String(formData.get("withSubcategory") ?? String(existingCategory.withSubcategory)) === "true",
  }

  const categoryParsed = DraftCategorySchema.safeParse(categoryData)
  if (!categoryParsed.success) {
    return {
      errors: categoryParsed.error._zod.def.map((issue) => issue.message),
      success: ""
    }
  }

  const parsedData = categoryParsed.data

  const updatedCategory: Category = {
    ...existingCategory,
    name: parsedData.name,
    budget: parsedData.budget,
    frequency: parsedData.frequency,
    dtstart: parsedData.dtstart,
    type: parsedData.type,
    icon: parsedData.icon ?? "",
    color: parsedData.color ?? "",
    order: parsedData.order ?? existingCategory.order,
    isActive: parsedData.isActive,
    withSubcategory: parsedData.withSubcategory,
    updatedAt: new Date().toISOString()
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("categories", "readwrite")
    const store = tx.objectStore("categories")
    const request = store.put(updatedCategory)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo actualizar la categoría"))
  })

  return {
    errors: [],
    success: "Categoría actualizada"
  }
}

// Elimina una categoría local por ID.
export async function deleteCategory(prevState: ActionStateType, formData: FormData) {
  const categoryId = Number(formData.get("categoryId"))

  if (!categoryId) {
    return {
      errors: ["ID de categoría no proporcionado."],
      success: ""
    }
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("categories", "readwrite")
    const store = tx.objectStore("categories")
    const request = store.delete(categoryId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo eliminar la categoría"))
  })

  return {
    errors: [],
    success: "Categoría eliminada"
  }
}
