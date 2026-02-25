'use client'

import { useState } from 'react'
import { LogOut, Settings } from 'lucide-react'
import { z } from 'zod'
import { UserSchema } from '@/src/schemas'
import { logoutAction } from '@/src/actions/logout-action'
import { EditProfileModal } from './edit-profile-modal'
import { useRouter } from 'next/navigation'
import { EditLocalUserModal } from './edit-local-user-modal'
import { useSWRConfig } from 'swr'
import { emitSessionCacheInvalidate } from '@/src/auth/session-cache-events'

type User = z.infer<typeof UserSchema>

interface UserProfileProps {
    user: User
    source?: "backend" | "local"
}

// Muestra el resumen del usuario autenticado y un menú desplegable de acciones.
export function UserProfile({ user, source = "backend" }: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isLocalConfigModalOpen, setIsLocalConfigModalOpen] = useState(false)
    const router = useRouter()
    const { mutate: globalMutate } = useSWRConfig()
    const isLocalUser = source === "local"

    // Cierra la sesión del usuario actual.
    const handleLogout = async () => {
        // Limpia caché de dashboard ligada a sesión antes de invalidar/logout.
        await globalMutate(
            (key) => Array.isArray(key) && key[0] === 'dashboard',
            undefined,
            { revalidate: false }
        )
        emitSessionCacheInvalidate()
        await logoutAction()
    }

    // Abre el modal de edición de perfil
    const handleEditProfile = () => {
        setIsOpen(false)
        setIsEditModalOpen(true)
    }

    const handleLocalConfig = () => {
        // En modo local se abre modal de configuración local en vez de perfil backend.
        setIsOpen(false)
        setIsLocalConfigModalOpen(true)
    }

    // Maneja el éxito de la actualización
    const handleUpdateSuccess = () => {
        setIsEditModalOpen(false)
        router.refresh() // Refresca la página para obtener los datos actualizados
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
                        {isLocalUser ? (
                            <button
                                onClick={handleLocalConfig}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                Configuración
                            </button>
                        ) : (
                            <>
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>

                                <button
                                    onClick={handleEditProfile}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Editar Perfil
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar sesión
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Modal de edición de perfil */}
            <EditProfileModal
                open={isEditModalOpen}
                user={user}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleUpdateSuccess}
            />

            <EditLocalUserModal
                open={isLocalConfigModalOpen}
                user={user}
                onCancel={() => setIsLocalConfigModalOpen(false)}
                onSuccess={() => {
                    setIsLocalConfigModalOpen(false)
                    router.refresh()
                }}
            />
        </div>
    )
}
