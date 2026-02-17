'use client'

import { useState } from 'react'
import { User, LogOut, Settings } from 'lucide-react'
import { z } from 'zod'
import { UserSchema } from '@/src/schemas'
import { logoutAction } from '@/src/actions/logout-action'

type User = z.infer<typeof UserSchema>

interface UserProfileProps {
    user: User
}

// Muestra el resumen del usuario autenticado y un menú desplegable de acciones.
export function UserProfile({ user }: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Cierra la sesión del usuario actual.
    const handleLogout = async () => {
        await logoutAction()
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Overlay para cerrar el dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                // TODO: Implementar navegación a perfil
                                console.log('Ir a perfil')
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Configuración
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
