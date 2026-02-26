'use client'

import { currencies } from '@/src/types/transaction-types'
import { BaseCurrency } from '@/src/types/transaction-types'
import { AppLocale } from '@/src/i18n/config'
import { LanguageSelector } from '@/src/components/ui/language-selector'
import { useLocale, useTranslations } from 'next-intl'

interface ProfileFormFieldsProps {
    name: string
    setName: (value: string) => void
    fullName: string
    setFullName: (value: string) => void
    email: string
    setEmail: (value: string) => void
    baseCurrency: string
    setBaseCurrency: (value: BaseCurrency) => void
    timeZone: string
    setTimeZone: (value: string) => void
    avatar: string
    setAvatar: (value: string) => void
    language: AppLocale
    setLanguage: (value: AppLocale) => void
}

/**
 * Componente con los campos del formulario de edición de perfil.
 * Separado para mantener EditProfileModal más limpio y enfocado en la lógica.
 * 
 * Incluye:
 * - Campos de texto: nombre, nombre completo, email
 * - Selectores: moneda base, zona horaria
 * - Campo opcional: URL de avatar
 */
export function ProfileFormFields({
    name,
    setName,
    fullName,
    setFullName,
    email,
    setEmail,
    baseCurrency,
    setBaseCurrency,
    timeZone,
    setTimeZone,
    avatar,
    setAvatar,
    language,
    setLanguage
}: ProfileFormFieldsProps) {
    const t = useTranslations("ProfileFields")
    const locale = useLocale()
    // Obtener zonas horarias disponibles del sistema
    const timeZones = Intl.supportedValuesOf('timeZone')

    return (
        <div className="flex flex-col gap-4">
            {/* Input nombre */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    {t("name")}
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder={t("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    required
                />
            </div>

            {/* Input nombre completo */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    {t("fullName")}
                </label>
                <input
                    type="text"
                    name="fullName"
                    placeholder={t("fullName")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    required
                />
            </div>

            {/* Input email */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    required
                />
            </div>

            {/* Selector de moneda base */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    {t("baseCurrency")}
                </label>
                <select
                    name="baseCurrency"
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value as BaseCurrency)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                    required
                >
                    {currencies.map(curr => (
                        <option key={curr.currency} value={curr.currency}>
                            {curr.currency} - {new Intl.DisplayNames([locale], { type: "currency" }).of(curr.currency)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selector de zona horaria */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    {t("timeZone")}
                </label>
                <select
                    name="timeZone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                    required
                >
                    {timeZones.map(tz => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selector de idioma de interfaz */}
            <LanguageSelector
                name="language"
                value={language}
                onChange={setLanguage}
                persistOnChange={false}
            />

            {/* Input avatar URL (opcional) */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    {t("avatar")} <span className="text-xs font-normal text-gray-500">({t("optional")})</span>
                </label>
                <input
                    type="url"
                    name="avatar"
                    placeholder={t("avatarPlaceholder")}
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                />
            </div>
        </div>
    )
}
