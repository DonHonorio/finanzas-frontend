'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Logo } from '../ui/logo'
import { AuthModal } from '../auth/auth-modal'
import { UserProfile } from '../ui/user-profile'
import { UserSchema } from '@/src/schemas'

type User = z.infer<typeof UserSchema>

interface HeaderProps {
    user?: User | null
}

export function Header({ user }: HeaderProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    return (
        <>
            <header className="w-full px-8 py-4 flex items-center justify-between bg-white border-b border-gray-200">
                <Logo />
                
                {user ? (
                    <UserProfile user={user} />
                ) : (
                    <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                    >
                        Iniciar Sesión
                    </button>
                )}
            </header>

            {!user && (
                <AuthModal 
                    isOpen={isAuthModalOpen} 
                    onClose={() => setIsAuthModalOpen(false)}
                    onSuccess={() => setIsAuthModalOpen(false)}
                />
            )}
        </>
    )
}
