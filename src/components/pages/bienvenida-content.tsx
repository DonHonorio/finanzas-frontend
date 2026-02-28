'use client'

import { X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { LoginForm } from "@/src/components/auth/login-form"
import { LanguageSelector } from "@/src/components/ui/language-selector"
import { AppLocale } from "@/src/i18n/config"
import { setLocaleAction } from "@/src/actions/set-locale-action"
import Image from "next/image"

type Props = {
    locale: AppLocale
    onLocaleChange: (locale: AppLocale) => void
}

export function BienvenidaContent({ locale, onLocaleChange }: Props) {
    const t = useTranslations("WelcomePage")
    const headlineLines = t("headline").split("\n")
    const [showLogin, setShowLogin] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()

    function handleLoginSuccess() {
        // Al iniciar sesión desde otro navegador, marcamos el onboarding como visto
        localStorage.setItem('fp_onboarding_completed', 'true')
        setShowLogin(false)
        router.replace('/')
    }

    async function handleGetStarted() {
        setIsNavigating(true)
        await setLocaleAction(locale)
        // Navegación completa para que el root layout lea el cookie actualizado
        window.location.href = '/configuracion-basica'
    }

    return (
        <div className="min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto flex flex-col items-center justify-start sm:justify-center bg-gray-50 px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-16">

            {/* Barra superior — fija, con fondo translúcido para no tapar el contenido */}
            <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-gray-50/80 backdrop-blur-sm">

                {/* Selector de idioma — esquina superior izquierda */}
                <LanguageSelector
                    value={locale}
                    onChange={onLocaleChange}
                    persistOnChange={false}
                    label=""
                    className="w-auto [&>label]:hidden"
                    selectClassName="py-1.5 px-2 text-sm w-32"
                />

                {/* Botón de login — derecha */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="hidden sm:block text-sm text-gray-500">{t("alreadyHaveAccount")}</span>
                    <button
                        onClick={() => setShowLogin(true)}
                        className="text-sm font-semibold text-primary border border-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                    >
                        {t("signIn")}
                    </button>
                </div>
            </div>

            {/* Modal de login */}
            {showLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                        {/* Cabecera del modal */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            <h2 className="text-xl font-bold text-gray-900">{t("modalTitle")}</h2>
                            <button
                                onClick={() => setShowLogin(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label={t("close")}
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

            <div className="max-w-2xl w-full flex flex-col items-center gap-5 sm:gap-10">

                {/* Logo / Icono de la app */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-56 h-20 sm:w-72 sm:h-24">
                        <Image
                            src="/logoRiconomy.png"
                            alt="Riconomy"
                            fill
                            priority
                            className="object-contain"
                            sizes="(min-width: 640px) 288px, 224px"
                        />
                    </div>
                    <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                        {t("brand")}
                    </p>
                </div>

                {/* Mensaje principal */}
                <div className="text-center flex flex-col gap-6">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
                        {headlineLines.map((line, index) => (
                            <span key={`${line}-${index}`}>
                                {line}
                                {index < headlineLines.length - 1 && <br />}
                            </span>
                        ))}
                    </h1>

                    <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                        {t("description")}
                    </p>

                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                        {t("description2")}
                    </p>

                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                        {t("description3")}
                    </p>
                </div>

                {/* Botón de acción */}
                <button
                    onClick={handleGetStarted}
                    disabled={isNavigating}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {t("start")}
                </button>

            </div>
        </div>
    )
}
