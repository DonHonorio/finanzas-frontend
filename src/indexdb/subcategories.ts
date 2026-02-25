import { ActionStateType } from "@/src/types/action-types"
import { Subcategory } from "@/src/types/category-types"
import { getDB } from "./db"
import { DraftSubcategorySchema } from "@/src/schemas"

// Lee subcategorías locales y filtra por categoría padre.
export async function getSubcategories(categoryId: number): Promise<Subcategory[]> {
  const db = await getDB()

  const subcategories = await new Promise<Subcategory[]>((resolve, reject) => {
    const tx = db.transaction("subcategories", "readonly")
    const store = tx.objectStore("subcategories")
    const request = store.getAll()

    request.onsuccess = () => resolve((request.result ?? []) as Subcategory[])
    request.onerror = () => reject(request.error ?? new Error("No se pudieron obtener las subcategorías"))
  })

  return subcategories.filter((subcategory) => subcategory.categoryId === categoryId)
}

// Crea subcategoría local validada y asociada a su categoría.
export async function createSubcategory(prevState: ActionStateType, formData: FormData) {
  const subcategoryData = {
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    description: formData.get("description"),
    budget: formData.get("budget"),
    color: formData.get("color"),
    order: formData.get("order"),
    isActive: String(formData.get("isActive") ?? "true") === "true",
  }

  const subcategoryParsed = DraftSubcategorySchema.safeParse(subcategoryData)
  if (!subcategoryParsed.success) {
    return {
      errors: subcategoryParsed.error._zod.def.map((issue) => issue.message),
      success: ""
    }
  }

  const parsedData = subcategoryParsed.data

  if (!parsedData.categoryId) {
    return {
      errors: ["ID de categoría no proporcionado."],
      success: ""
    }
  }

  const subcategory: Subcategory = {
    subcategoryId: Date.now(),
    categoryId: parsedData.categoryId,
    name: parsedData.name,
    description: parsedData.description,
    budget: parsedData.budget,
    color: parsedData.color,
    order: parsedData.order,
    isActive: parsedData.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("subcategories", "readwrite")
    const store = tx.objectStore("subcategories")
    const request = store.add(subcategory)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo crear la subcategoría"))
  })

  return {
    errors: [],
    success: "Subcategoría creada"
  }
}

// Actualiza subcategoría local existente con datos validados.
export async function updateSubcategory(prevState: ActionStateType, formData: FormData) {
  const subcategoryId = Number(formData.get("subcategoryId"))

  if (!subcategoryId) {
    return {
      errors: ["ID de subcategoría no proporcionado."],
      success: ""
    }
  }

  const db = await getDB()

  const existingSubcategory = await new Promise<Subcategory | undefined>((resolve, reject) => {
    const tx = db.transaction("subcategories", "readonly")
    const store = tx.objectStore("subcategories")
    const request = store.get(subcategoryId)

    request.onsuccess = () => resolve(request.result as Subcategory | undefined)
    request.onerror = () => reject(request.error ?? new Error("No se pudo leer la subcategoría"))
  })

  if (!existingSubcategory) {
    return {
      errors: ["Subcategoría no encontrada."],
      success: ""
    }
  }

  const subcategoryData = {
    categoryId: formData.get("categoryId") ?? existingSubcategory.categoryId,
    name: formData.get("name") ?? existingSubcategory.name,
    description: formData.get("description") ?? existingSubcategory.description,
    budget: formData.get("budget") ?? existingSubcategory.budget,
    color: formData.get("color") ?? existingSubcategory.color,
    order: formData.get("order") ?? existingSubcategory.order,
    isActive: String(formData.get("isActive") ?? String(existingSubcategory.isActive)) === "true",
  }

  const subcategoryParsed = DraftSubcategorySchema.safeParse(subcategoryData)
  if (!subcategoryParsed.success) {
    return {
      errors: subcategoryParsed.error._zod.def.map((issue) => issue.message),
      success: ""
    }
  }

  const parsedData = subcategoryParsed.data

  const updatedSubcategory: Subcategory = {
    ...existingSubcategory,
    categoryId: parsedData.categoryId ?? existingSubcategory.categoryId,
    name: parsedData.name,
    description: parsedData.description,
    budget: parsedData.budget,
    color: parsedData.color,
    order: parsedData.order,
    isActive: parsedData.isActive,
    updatedAt: new Date().toISOString()
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("subcategories", "readwrite")
    const store = tx.objectStore("subcategories")
    const request = store.put(updatedSubcategory)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo actualizar la subcategoría"))
  })

  return {
    errors: [],
    success: "Subcategoría actualizada"
  }
}

// Elimina subcategoría local por ID.
export async function deleteSubcategory(prevState: ActionStateType, formData: FormData) {
  const subcategoryId = Number(formData.get("subcategoryId"))

  if (!subcategoryId) {
    return {
      errors: ["ID de subcategoría no proporcionado."],
      success: ""
    }
  }

  const db = await getDB()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("subcategories", "readwrite")
    const store = tx.objectStore("subcategories")
    const request = store.delete(subcategoryId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("No se pudo eliminar la subcategoría"))
  })

  return {
    errors: [],
    success: "Subcategoría eliminada"
  }
}
