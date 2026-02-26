'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Logo } from '../ui/logo'
import { AuthModal } from '../auth/auth-modal'
import { UserProfile } from '../profile/user-profile'
import { UserSchema } from '@/src/schemas'
import { useTranslations } from 'next-intl'

type User = z.infer<typeof UserSchema>

interface HeaderProps {
    user?: User | null
    source?: "backend" | "local" | "none"
}

export function Header({ user, source = "none" }: HeaderProps) {
    const t = useTranslations("Header")
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const isLocalSource = source === "local"
    const isBackendSource = source === "backend"

    // Reglas de visibilidad según tipo de sesión.
    const showLoginButton = source === "none" || source === "local"
    const showUserProfile = !!user && (isBackendSource || isLocalSource)

    return (
        <>
            <header className="w-full px-8 py-4 flex items-center justify-between bg-white border-b border-gray-200">
                <Logo />

                <div className="flex items-center gap-3">
                {showUserProfile && (
                    <UserProfile user={user} source={isLocalSource ? "local" : "backend"} />
                )}

                {showLoginButton && (
                    <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                    >
                        {t("signIn")}
                    </button>
                )}
                </div>
            </header>

            {showLoginButton && (
                <AuthModal 
                    isOpen={isAuthModalOpen} 
                    onClose={() => setIsAuthModalOpen(false)}
                    onSuccess={() => setIsAuthModalOpen(false)}
                />
            )}
        </>
    )
}
