'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Cierra sesión eliminando la cookie y redirigiendo a /
export async function logoutAction() {
    const cookiesStore = await cookies()
    cookiesStore.delete('FINANZAS_TOKEN')
    redirect('/')
}
