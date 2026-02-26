'use client'

import { useState, useEffect, useActionState, useRef } from 'react'
import { createAccountAction } from '@/src/actions/create-account-action'
import { loginAction } from '@/src/actions/login-action'
import { currencies } from '@/src/types/transaction-types'
import { CancelButton } from '../ui/cancel-button'
import { SaveButton } from '../ui/save-button'
import { toast } from 'react-toastify'
import { syncLocalDataToBackend } from '@/src/data-layer/local-backend-migration'
import { clearLocalSessionIndicators } from '@/src/auth/clear-local-session'
import { emitSessionCacheInvalidate } from '@/src/auth/session-cache-events'
import { rollbackNewAccountAction } from '@/src/actions/rollback-new-account-action'
import { useLocale, useTranslations } from 'next-intl'

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
    const t = useTranslations("SignupForm")
    const locale = useLocale()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [baseCurrency, setBaseCurrency] = useState('')
    const [timeZone, setTimeZone] = useState('')
    const [migrateLocalData, setMigrateLocalData] = useState(false)
    const [isLocalSessionDetected, setIsLocalSessionDetected] = useState(false)
    const [availableTimeZones, setAvailableTimeZones] = useState<string[]>([])
    const [signupState, signupFormAction, isSignupPending] = useActionState<SignupActionState, FormData>(createAccountAction, null)
    const formRef = useRef<HTMLFormElement>(null)
    // Evita ejecutar dos veces el flujo post-signup cuando React re-renderiza con el mismo resultado.
    const lastHandledSignupUserRef = useRef<number | null>(null)

    // Detectar la zona horaria del navegador y obtener lista de zonas
    useEffect(() => {
        setIsLocalSessionDetected(Boolean(localStorage.getItem('localToken')))

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
        if (!signupState?.success) return

        const signupUserId = signupState.userId ?? null
        if (signupUserId && lastHandledSignupUserRef.current === signupUserId) return
        lastHandledSignupUserRef.current = signupUserId

        void (async () => {
            toast.success(signupState.message || t("success"))

            // Flujo opcional de migración: login backend temporal + migración + rollback si algo falla.
            if (migrateLocalData && isLocalSessionDetected) {
                let mustRollback = false

                try {
                    const loginFormData = new FormData()
                    loginFormData.append('email', email)
                    loginFormData.append('password', password)
                    loginFormData.append('preserveLocalSession', 'true')

                    const loginResult = await loginAction(null, loginFormData)

                    if (!loginResult?.success) {
                        mustRollback = true
                        toast.error(t("backendLoginError"))
                    } else {
                        const migrationResult = await syncLocalDataToBackend()

                        if (!migrationResult.success) {
                            mustRollback = true
                            toast.warn(migrationResult.message)
                            if (migrationResult.errors.length > 0) {
                                toast.error(migrationResult.errors[0])
                            }
                        } else {
                            toast.success(migrationResult.message)
                        }
                    }
                } catch {
                    mustRollback = true
                    toast.error(t("migrationUnexpectedError"))
                }

                if (mustRollback) {
                    const rollbackResult = await rollbackNewAccountAction()
                    if (!rollbackResult.success) {
                        toast.error(rollbackResult.message)
                    }
                    return
                }
            }

            // Solo en éxito completo se limpia el estado local y se notifica invalidez de caché de sesión.
            clearLocalSessionIndicators()
            emitSessionCacheInvalidate()

            setEmail('')
            setName('')
            setFullName('')
            setPassword('')
            setBaseCurrency('')
            setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
            setMigrateLocalData(false)

            if (onSuccess) {
                onSuccess()
            }
        })()
    }, [signupState, onSuccess, migrateLocalData, isLocalSessionDetected, email, password])

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
                    {t("username")}
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
                    {t("fullName")}
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
                    {t("password")}
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
                    {t("baseCurrency")}
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
                        {t("selectCurrency")}
                    </option>
                    {currencies.map((curr: { currency: string; description: string }) => (
                        <option key={curr.currency} value={curr.currency}>
                            {curr.currency} - {new Intl.DisplayNames([locale], { type: "currency" }).of(curr.currency)}
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
                    {t("timeZone")}
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
                <p className="text-xs text-gray-500 mt-1">{t("detectedTimeZone")}</p>
            </div>

            {isLocalSessionDetected && (
                // Switch explícito para decidir si se copia data local al nuevo perfil backend.
                <div className="flex items-center justify-between rounded-md border border-gray-300 px-3 py-2">
                    <div className="pr-3">
                        <p className="text-sm font-medium text-gray-700">{t("migrateTitle")}</p>
                        <p className="text-xs text-gray-500">{t("migrateDescription")}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={migrateLocalData}
                            onChange={(e) => setMigrateLocalData(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <CancelButton onClick={onClose} />
                <SaveButton isPending={isSignupPending} isValid={true} label={t("submit")} />
            </div>
        </form>
    )
}
