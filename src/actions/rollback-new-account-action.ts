'use server'

import { getToken } from '@/src/auth/token'
import { cookies } from 'next/headers'

type RollbackResult = {
  success: boolean
  message: string
}

// Revierte una cuenta backend recién creada cuando falla el flujo de migración.
export async function rollbackNewAccountAction(): Promise<RollbackResult> {
  // Solo se puede revertir si existe token backend vigente.
  const token = await getToken()
  if (!token) {
    return {
      success: false,
      message: 'No hay sesión backend para revertir la cuenta.'
    }
  }

  try {
    // El backend identifica al usuario a eliminar mediante JWT.
    const req = await fetch(`${process.env.API_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!req.ok) {
      const json = await req.json().catch(() => null)
      return {
        success: false,
        message: json?.error ?? 'No se pudo revertir la cuenta backend.'
      }
    }

    // Limpia la sesión backend para evitar estado parcial tras el rollback.
    const cookieStore = await cookies()
    cookieStore.delete('FINANZAS_TOKEN')

    return {
      success: true,
      message: 'Cuenta backend revertida correctamente.'
    }
  } catch {
    return {
      success: false,
      message: 'Error de conexión al intentar revertir la cuenta backend.'
    }
  }
}
