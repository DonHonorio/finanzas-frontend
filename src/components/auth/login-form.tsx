'use client'

import { useState, useRef } from 'react'
import { loginAction } from '@/src/actions/login-action'
import { CancelButton } from '../ui/cancel-button'
import { SaveButton } from '../ui/save-button'
import { toast } from 'react-toastify'
import { emitSessionCacheInvalidate } from '@/src/auth/session-cache-events'
import { clearLocalSessionIndicators } from '@/src/auth/clear-local-session'

interface LoginFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

type LoginActionState = {
    success: boolean;
    message?: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
} | null;

/**
 * Formulario de inicio de sesión
 */
export function LoginForm({ onClose, onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginPending, setIsLoginPending] = useState(false)
    const [loginState, setLoginState] = useState<LoginActionState>(null)
    const formRef = useRef<HTMLFormElement>(null)

    // Submit controlado para ejecutar efectos críticos inmediatamente tras respuesta del login.
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoginPending(true)

        try {
            const formData = new FormData(event.currentTarget)
            const result = await loginAction(null, formData)
            setLoginState(result as LoginActionState)

            if (result?.success) {
                // Al autenticarse en backend se desactiva estado local y se invalida caché de sesión.
                clearLocalSessionIndicators()
                emitSessionCacheInvalidate()
                toast.success(result.message || 'Inicio de sesión exitoso')
                setEmail('')
                setPassword('')
                if (onSuccess) {
                    onSuccess()
                }
            }
        } finally {
            setIsLoginPending(false)
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Mensaje de error general */}
            {loginState && !loginState.success && loginState.message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {loginState.message}
                </div>
            )}

            {/* Email */}
            <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {loginState?.errors?.email && (
                    <p className="text-red-500 text-sm mt-1">{loginState.errors.email[0]}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {loginState?.errors?.password && (
                    <p className="text-red-500 text-sm mt-1">{loginState.errors.password[0]}</p>
                )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <CancelButton onClick={onClose} />
                <SaveButton isPending={isLoginPending} isValid={true} label="Iniciar Sesión" />
            </div>
        </form>
    )
}
