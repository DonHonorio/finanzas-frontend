import { Category } from '@/src/types/category-types'
import { cn } from "@/src/lib/utils"

interface CategorySelectorProps {
    category: string | number
    categories: Category[]
    type: 'expense' | 'income' // Filtra categorías según el tipo de transacción
    disabled?: boolean        // Deshabilitado cuando viene de subcategoría (ya pre-seleccionada)
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

// Selector de categoría filtrado por tipo (gasto/ingreso)
export function CategorySelector({ category, categories, type, disabled, onChange }: CategorySelectorProps) {
    return (
        <div>
            <label className="block text-[15px] font-semibold text-gray-700 mb-1">Categoría</label>
            {/* Cuando está deshabilitado, el valor se envía como hidden en lugar de usar el select */}
            {disabled && <input type="hidden" name="category" value={category} />}
            <select
                key={`category-${category}`}
                name={disabled ? undefined : "category"} // Evita duplicidad en FormData
                value={category}
                onChange={onChange}
                disabled={disabled}
                className={cn(
                    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:border-primary",
                    disabled
                        ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                        : "bg-white"
                )}
            >
                <option value="">Selecciona una categoría</option>
                {categories.filter(cat => cat.type === type).map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    )
}