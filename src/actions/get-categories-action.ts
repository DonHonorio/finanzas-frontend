"use server"

import { getToken } from "../auth/token"
import { Category } from "../types/category-types"

// Server action para obtener categorías desde la API externa
export async function getCategories(): Promise<Category[]> {
    const token = await getToken()
    const url = `${process.env.API_URL}/categories`
    
    if (!token) return [] // Sin token, no se puede autenticar

    try {
        const req = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!req.ok) {
            console.error("Error fetching categories:", await req.text())
            return []
        }

        const data = await req.json()
        return data.categories || [] // API devuelve { categories: [...] }
    } catch (error) {
        console.error("Error in getCategories action:", error)
        return []
    }
}