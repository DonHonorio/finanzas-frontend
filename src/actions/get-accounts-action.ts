"use server"

import { getToken } from "../auth/token"
import { Account } from "../types/account-types"

// Server action para obtener cuentas desde la API externa
export async function getAccounts(): Promise<Account[]> {
    const token = await getToken()
    const url = `${process.env.API_URL}/accounts`
    
    // Si no hay token, retornamos array vacío o lanzamos error (aquí array vacío)
    if (!token) return []

    try {
        const req = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!req.ok) {
            console.error("Error fetching accounts:", await req.text())
            return []
        }

        const data = await req.json()
        return data.accounts || [] // API devuelve { accounts: [...] }
    } catch (error) {
        console.error("Error in getAccounts action:", error)
        return []
    }
}