'use client'

import { useState, useEffect, useActionState, useRef } from 'react'
import { createAccountAction } from '@/src/actions/create-account-action'
import { currencies } from '@/src/types/transaction-types'
import { CancelButton } from '../ui/cancel-button'
import { SaveButton } from '../ui/save-button'
import { toast } from 'react-toastify'

interface SignupFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

type SignupActionState = {
    success: boolean;
    message?: string;
    errors?: {
        email?: string[];
        name?: string[];
        fullName?: string[];
        password?: string[];
        baseCurrency?: string[];
        timeZone?: string[];
    };
    userId?: number;
} | null;

/**
 * Formulario de registro de cuenta
 */
export function SignupForm({ onClose, onSuccess }: SignupFormProps) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [baseCurrency, setBaseCurrency] = useState('')
    const [timeZone, setTimeZone] = useState('')
    const [availableTimeZones, setAvailableTimeZones] = useState<string[]>([])
    const [signupState, signupFormAction, isSignupPending] = useActionState<SignupActionState, FormData>(createAccountAction, null)
    const formRef = useRef<HTMLFormElement>(null)

    // Detectar la zona horaria del navegador y obtener lista de zonas
    useEffect(() => {
        const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimeZone(detectedTimeZone)
        
        // Obtener todas las zonas horarias disponibles
        try {
            // @ts-ignore - supportedValuesOf puede no estar en todos los tipos
            const zones = Intl.supportedValuesOf('timeZone')
            setAvailableTimeZones(zones)
        } catch {
            // Fallback a zonas horarias comunes si no está disponible
            setAvailableTimeZones([
                'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
                'America/Mexico_City', 'America/Bogota', 'America/Lima', 'America/Santiago',
                'America/Buenos_Aires', 'America/Sao_Paulo', 'Europe/London', 'Europe/Paris',
                'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome', 'Asia/Tokyo', 'Asia/Shanghai',
                'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Dubai', 'Australia/Sydney',
                'Pacific/Auckland', 'UTC'
            ])
        }
    }, [])

    // Manejar el éxito del signup
    useEffect(() => {
        if (signupState?.success) {
            toast.success(signupState.message || 'Cuenta creada exitosamente')
            // Reset de los estados
            setEmail('')
            setName('')
            setFullName('')
            setPassword('')
            setBaseCurrency('')
            setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
            if (onSuccess) {
                onSuccess()
            }
        }
    }, [signupState, onSuccess])

    return (
        <form ref={formRef} action={signupFormAction} className="p-6 space-y-4">
            {/* Mensaje de error general */}
            {signupState && !signupState.success && signupState.message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {signupState.message}
                </div>
            )}

            {/* Email */}
            <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {signupState?.errors?.email && (
                    <p className="text-red-500 text-sm mt-1">{signupState.errors.email[0]}</p>
                )}
            </div>

            {/* Name */}
            <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de usuario
                </label>
                <input
                    type="text"
                    id="signup-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {signupState?.errors?.name && (
                    <p className="text-red-500 text-sm mt-1">{signupState.errors.name[0]}</p>
                )}
            </div>

            {/* FullName */}
            <div>
                <label htmlFor="signup-fullname" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                </label>
                <input
                    type="text"
                    id="signup-fullname"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={120}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {signupState?.errors?.fullName && (
                    <p className="text-red-500 text-sm mt-1">{signupState.errors.fullName[0]}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {signupState?.errors?.password && (
                    <p className="text-red-500 text-sm mt-1">{signupState.errors.password[0]}</p>
                )}
            </div>

            {/* Base Currency */}
            <div>
                <label htmlFor="signup-currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Moneda base
                </label>
                <select
                    id="signup-currency"
                    name="baseCurrency"
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="" disabled>
                        Selecciona una moneda
                    </option>
                    {currencies.map((curr: { currency: string; description: string }) => (
                        <option key={curr.currency} value={curr.currency}>
                            {curr.currency} - {curr.description}
                        </option>
                    ))}
                </select>
                {signupState?.errors?.baseCurrency && (
                    <p className="text-red-500 text-sm mt-1">{signupState.errors.baseCurrency[0]}</p>
                )}
            </div>

            {/* Time Zone */}
            <div>
                <label htmlFor="signup-timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Zona horaria
                </label>
                <select
                    id="signup-timezone"
                    name="timeZone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    {availableTimeZones.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
                {signupState?.errors?.timeZone && (
                    <p className="text-red-500 text-sm mt-1">{signupState.errors.timeZone[0]}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Se detectó automáticamente tu zona horaria</p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <CancelButton onClick={onClose} />
                <SaveButton isPending={isSignupPending} isValid={true} label="Crear Cuenta" />
            </div>
        </form>
    )
}
