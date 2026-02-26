'use client'

import { Subcategory } from '@/src/types/category-types'
import { cn } from "@/src/lib/utils"
import { DesmarcarButton } from "@/src/components/ui/desmarcar-button"
import { useTranslations } from "next-intl"

interface SubcategorySelectorProps {
    subcategory: string
    availableSubcategories: Subcategory[]
    disabled?: boolean
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onClear: () => void
}

// Selector de subcategoría (opcional) con opción para limpiar selección
export function SubcategorySelector({
    subcategory,
    availableSubcategories,
    disabled,
    onChange,
    onClear
}: SubcategorySelectorProps) {
    const t = useTranslations("Selectors")

    // Si no hay subcategorías disponibles, no mostramos el selector
    if (availableSubcategories.length === 0) {
        return null
    }

    return (
        <div>
            <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                {t("subcategory")} {!disabled && <span className="text-xs font-normal text-gray-500">({t("optional")})</span>}
            </label>
            <div className="relative">
                {/* Cuando está deshabilitado, el valor se envía como hidden */}
                {disabled && subcategory && <input type="hidden" name="subcategory" value={subcategory} />}
                <select
                    key={`subcategory-${subcategory}`}
                    name={disabled ? undefined : "subcategory"}
                    value={subcategory}
                    onChange={onChange}
                    disabled={disabled}
                    className={cn(
                        "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary",
                        disabled
                            ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                            : "bg-white",
                        !disabled && subcategory && "pr-10"
                    )}
                >
                    <option value="">{t("noSubcategory")}</option>
                    {availableSubcategories.map(subcat => (
                        <option key={subcat.subcategoryId} value={subcat.subcategoryId}>
                            {subcat.name}
                        </option>
                    ))}
                </select>
                {/* Botón limpiar solo cuando está habilitado y hay selección */}
                {!disabled && subcategory && (
                    <DesmarcarButton
                        onClick={onClear}
                        title={t("clearSelectedSubcategory")}
                    />
                )}
            </div>
        </div>
    )
}
