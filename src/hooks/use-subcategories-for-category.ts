import { useState, useEffect } from 'react'
import { Category, Subcategory } from '@/src/types/category-types'
import { getSubcategories } from '@/src/actions/get-subcategories-action'

// Hook para cargar y gestionar subcategorías según la categoría seleccionada en el formulario de transacción.
export function useSubcategoriesForCategory(
    category: string | number,
    categories: Category[],
    subcategories?: Subcategory[]
) {
    // Estado para las subcategorías disponibles según la categoría seleccionada
    const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([])

    // Cargar subcategorías cuando cambia la categoría
    useEffect(() => {
        const loadSubcategories = async () => {
            if (!category) {
                setAvailableSubcategories([])
                return
            }

            // Si ya tenemos subcategorías precargadas, filtrarlas por categoría
            if (subcategories) {
                const filtered = subcategories.filter(s => String(s.categoryId) === String(category))
                setAvailableSubcategories(filtered)
                return
            }

            // Si no hay subcategorías precargadas, cargarlas desde la API
            const selectedCategory = categories.find(cat => String(cat.categoryId) === String(category))
            if (selectedCategory?.withSubcategory) {
                try {
                    const subcats = await getSubcategories(Number(category))
                    setAvailableSubcategories(subcats)
                } catch (error) {
                    console.error('Error loading subcategories:', error)
                    setAvailableSubcategories([])
                }
            } else {
                setAvailableSubcategories([])
            }
        }

        loadSubcategories()
    }, [category, categories, subcategories])

    return availableSubcategories
}
