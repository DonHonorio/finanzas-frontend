'use client'

import { useState } from 'react'
import { Logo } from '../ui/logo'
import { AuthModal } from '../auth/auth-modal'

/**
 * Componente de header reutilizable con logo y botón de autenticación
 */
export function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    return (
        <>
            {/* Header */}
            <header className="w-full px-8 py-4 flex items-center justify-between bg-white border-b border-gray-200">
                <Logo />
                
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                    Iniciar Sesión
                </button>
            </header>

            {/* Modal de Autenticación */}
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    console.log('Usuario autenticado exitosamente')
                }}
            />
        </>
    )
}
