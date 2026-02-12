"use server"

import { getToken } from "../auth/token"
import { Transaction } from "../types/transaction-types"

// Server action para obtener transacciones de una categoría específica
export async function getCategoryTransactions(categoryId: number): Promise<Transaction[]> {
    const token = await getToken()

    // Endpoint anidado: GET /categories/{categoryId}/transactions
    const url = `${process.env.API_URL}/categories/${categoryId}/transactions`

    if (!token) return []

    try {
        const req = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!req.ok) {
            console.error("Error fetching category transactions:", await req.text())
            return []
        }

        const data = await req.json()
        return data.transactions || [] // API devuelve { transactions: [...] }
    } catch (error) {
        console.error("Error in getCategoryTransactions action:", error)
        return []
    }
}