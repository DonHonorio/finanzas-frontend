import { getToken } from "@/src/auth/token";

export async function GET(request: Request, { params }: { params: Promise<{ type: string; year: string }> }) {
    // Extrae tipo (expenses/incomes) y año de los parámetros de la ruta
    const { type, year } = await params

    // Token JWT para autenticación con la API backend
    const token = await getToken()
    if (!token) {
        return {
            errors: ['No autenticado. Por favor, inicia sesión.'],
            success: ''
        }
    }

    // Alternativa comentada: endpoint falso para testing sin backend
    const url = `${process.env.API_URL}/categories/dashboard/?type=${type}&year=${year}`
    // const url = `${process.env.API_URL}/categories/dashboardFake` // PARA TESTING LOCAL

    // Petición al backend
    const req = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()

    if (!req.ok) {
        return Response.json(json.error, { status: 403 })
    }

    return Response.json(json)
}