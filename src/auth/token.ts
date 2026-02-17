import { cookies } from "next/headers"

// Obtiene el token desde la cookie FINANZAS_TOKEN
export const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('FINANZAS_TOKEN')?.value
}

// Guarda el token en la cookie FINANZAS_TOKEN con duración de 1 año
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