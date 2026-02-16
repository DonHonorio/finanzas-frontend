import { cookies } from "next/headers"

// Obtiene el token JWT de autenticación desde las cookies de la petición
// Se ejecuta en la parte del servidor de nextjs (server action o route handler)
export const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('FINANZAS_TOKEN')?.value
}

// Establece el token JWT de autenticación en una cookie
// Se ejecuta en la parte del servidor de nextjs (server action)
export const setToken = async (token: string) => {
  const cookieStore = await cookies()
  const oneYear = 365 * 24 * 60 * 60 // Un año en segundos
  
  cookieStore.set('FINANZAS_TOKEN', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: oneYear,
    path: '/'
  })
}