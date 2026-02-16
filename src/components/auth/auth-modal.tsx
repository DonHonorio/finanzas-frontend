'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// Modal de autenticación que permite alternar entre login y signup
export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login')

    const handleLoginSuccess = () => {
        // Notificar éxito
        if (onSuccess) {
            onSuccess()
        }
        // Cerrar modal
        onClose()
    }

    const handleSignupSuccess = () => {
        // Cambiar a modo login después de crear cuenta exitosamente
        setMode('login')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                            mode === 'login'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                            mode === 'signup'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Crear Cuenta
                    </button>
                </div>

                {/* Formulario de Login */}
                {mode === 'login' && (
                    <LoginForm onClose={onClose} onSuccess={handleLoginSuccess} />
                )}

                {/* Formulario de Signup */}
                {mode === 'signup' && (
                    <SignupForm onClose={onClose} onSuccess={handleSignupSuccess} />
                )}
            </div>
        </div>
    )
}
