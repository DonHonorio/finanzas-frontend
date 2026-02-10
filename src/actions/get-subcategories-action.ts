"use server"

import { getToken } from "../auth/token"
import { Subcategory } from "../types/category-types"

export async function getSubcategories(categoryId: number): Promise<Subcategory[]> {
    const token = await getToken()
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
        return data.subcategories || []
    } catch (error) {
        console.error("Error in getSubcategories action:", error)
        return []
    }
}
