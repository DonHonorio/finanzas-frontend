import { getUserAction as getUserBackend } from "@/src/actions/get-user-action"

// Resuelve usuario únicamente para sesión backend; en local lo resuelve el cliente.
export async function getUserBySessionType(sessionType: "backend" | "local" | "none") {
    if (sessionType === "backend") {
        return getUserBackend()
    }

    return null
}
