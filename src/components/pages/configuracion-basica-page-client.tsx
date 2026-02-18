'use client'

import { Globe, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { currencies } from "@/src/types/transaction-types"

// Clave usada en localStorage para registrar que el usuario ya completó el onboarding
const ONBOARDING_KEY = 'fp_onboarding_completed'

// Pantalla de configuración básica: primera selección de moneda y zona horaria.
// Al confirmar guarda el flag en localStorage y redirige al inicio.
export function ConfiguracionBasicaPageClient() {
    const router = useRouter()
    const timeZones = Intl.supportedValuesOf('timeZone')

    function handleContinuar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        localStorage.setItem(ONBOARDING_KEY, 'true')
        router.replace('/')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-16">
            <div className="max-w-xl w-full flex flex-col items-center gap-10">

                {/* Encabezado */}
                <div className="text-center flex flex-col gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Configura tu espacio
                    </h1>
                    <p className="text-gray-500 text-base">
                        Elige tu moneda y zona horaria para personalizar tu experiencia.
                    </p>
                </div>

                {/* Formulario de configuración */}
                <form onSubmit={handleContinuar} className="w-full flex flex-col gap-6">

                    {/* Moneda */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Moneda</h2>
                        </div>
                        <select name="baseCurrency" defaultValue="EUR" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
                            {currencies.map(curr => (
                                <option key={curr.currency} value={curr.currency}>
                                    {curr.currency} - {curr.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Zona horaria */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Zona horaria</h2>
                        </div>
                        <select name="timeZone" defaultValue="Europe/Madrid" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
                            {timeZones.map(tz => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón continuar */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-100"
                    >
                        Continuar
                    </button>

                </form>

            </div>
        </div>
    )
}
