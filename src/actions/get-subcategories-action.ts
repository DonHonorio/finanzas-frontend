"use server"

import { getToken } from "../auth/token"
import { Subcategory } from "../types/category-types"

// Server action para obtener subcategorías de una categoría específica
export async function getSubcategories(categoryId: number): Promise<Subcategory[]> {
    const token = await getToken()
    
    // Endpoint anidado: GET /categories/{categoryId}/subcategories
    const url = `${process.env.API_URL}/categories/${categoryId}/subcategories`
    
    if (!token) return []

    try {
        const req = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!req.ok) {
            console.error("Error fetching subcategories:", await req.text())
            return []
        }

        const data = await req.json()
        return data.subcategories || [] // API devuelve { subcategories: [...] }
    } catch (error) {
        console.error("Error in getSubcategories action:", error)
        return []
    }
}