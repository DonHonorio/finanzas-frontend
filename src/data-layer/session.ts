import { getLocalToken, getToken } from "@/src/auth/token"

// Determina el tipo de sesión a partir de cookies backend/local en entorno server.
export async function getSessionType(): Promise<"backend" | "local" | "none"> {
    const token = await getToken()
    if (token) return "backend"

    const localToken = await getLocalToken()
    if (localToken) return "local"

    return "none"
}
