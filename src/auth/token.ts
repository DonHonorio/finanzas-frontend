import { cookies } from "next/headers"

// Obtiene el token JWT de autenticación desde las cookies de la petición
// Se ejecuta en la parte del servidor de nextjs (server action o route handler)
export const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('FINANZAS_TOKEN')?.value
}