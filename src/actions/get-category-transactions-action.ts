"use server"

import { getToken } from "../auth/token"
import { Transaction } from "../types/transaction-types"

export async function getCategoryTransactions(categoryId: number): Promise<Transaction[]> {
    const token = await getToken()
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
        return data.transactions || []
    } catch (error) {
        console.error("Error in getCategoryTransactions action:", error)
        return []
    }
}
