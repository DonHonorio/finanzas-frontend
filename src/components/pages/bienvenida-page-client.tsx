'use client'

import Link from "next/link"
import { Wallet, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/src/components/auth/login-form"

// Pantalla de bienvenida: se muestra al usuario la primera vez que accede sin cuenta.
export function BienvenidaPageClient() {
    const [showLogin, setShowLogin] = useState(false)
    const router = useRouter()

    function handleLoginSuccess() {
        // Al iniciar sesión desde otro navegador, marcamos el onboarding como visto
        localStorage.setItem('fp_onboarding_completed', 'true')
        setShowLogin(false)
        router.replace('/')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-16">

            {/* Barra superior con botón de login */}
            <div className="fixed top-0 left-0 right-0 flex justify-end items-center px-8 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">¿Ya tienes cuenta?</span>
                    <button
                        onClick={() => setShowLogin(true)}
                        className="text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>

            {/* Modal de login */}
            {showLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                        {/* Cabecera del modal */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            <h2 className="text-xl font-bold text-gray-900">Iniciar sesión</h2>
                            <button
                                onClick={() => setShowLogin(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <LoginForm
                            onClose={() => setShowLogin(false)}
                            onSuccess={handleLoginSuccess}
                        />
                    </div>
                </div>
            )}

            <div className="max-w-2xl w-full flex flex-col items-center gap-10">

                {/* Logo / Icono de la app */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
                        <Wallet className="w-14 h-14 text-white" />
                    </div>
                    <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                        Finanzas Personales
                    </p>
                </div>

                {/* Mensaje principal */}
                <div className="text-center flex flex-col gap-6">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        Bienvenido/a a tu nuevo<br />espacio financiero
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        Tu dinero, claro y bajo control. Registra tus ingresos y gastos,
                        asigna presupuestos a tus categorías y descubre en qué se va tu
                        dinero cada mes. Gestiona tus finanzas de forma simple, visual
                        y adaptada a ti.
                    </p>

                    <p className="text-gray-500 text-base leading-relaxed">
                        Empieza a tomar el control de tus finanzas personales con una
                        visión clara, organizada y sin complicaciones.
                    </p>

                    <p className="text-gray-500 text-base leading-relaxed">
                        Da el primer paso hacia una gestión más consciente y eficiente
                        de tu dinero.
                    </p>
                </div>

                {/* Botón de acción */}
                <Link
                    href="/configuracion-basica"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-100"
                >
                    Empezar
                </Link>

            </div>
        </div>
    )
}
