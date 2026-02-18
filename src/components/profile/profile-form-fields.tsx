import { currencies } from '@/src/types/transaction-types'

interface ProfileFormFieldsProps {
    name: string
    setName: (value: string) => void
    fullName: string
    setFullName: (value: string) => void
    email: string
    setEmail: (value: string) => void
    baseCurrency: string
    setBaseCurrency: (value: any) => void
    timeZone: string
    setTimeZone: (value: string) => void
    avatar: string
    setAvatar: (value: string) => void
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
    setAvatar
}: ProfileFormFieldsProps) {
    // Obtener zonas horarias disponibles del sistema
    const timeZones = Intl.supportedValuesOf('timeZone')

    return (
        <div className="flex flex-col gap-4">
            {/* Input nombre */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                    required
                />
            </div>

            {/* Input nombre completo */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    Nombre Completo
                </label>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Nombre completo"
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
                    Moneda Base
                </label>
                <select
                    name="baseCurrency"
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary bg-white"
                    required
                >
                    {currencies.map(curr => (
                        <option key={curr.currency} value={curr.currency}>
                            {curr.currency} - {curr.description}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selector de zona horaria */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    Zona Horaria
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

            {/* Input avatar URL (opcional) */}
            <div>
                <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                    Avatar URL <span className="text-xs font-normal text-gray-500">(opcional)</span>
                </label>
                <input
                    type="url"
                    name="avatar"
                    placeholder="https://ejemplo.com/avatar.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary"
                />
            </div>
        </div>
    )
}
