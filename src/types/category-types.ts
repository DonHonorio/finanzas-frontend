import { MonthlyData } from "./general-types"
import { Transaction } from "./transaction-types"

/**
 * Representa una categoría de gastos o ingresos en el sistema.
 * Las categorías agrupan transacciones similares (ej: "Alimentación", "Transporte", "Salario").
 * 
 * Uso principal:
 * - CategoryForm: formulario para crear/editar categorías
 * - ViewCategoryModal: modal para visualizar transacciones de una categoría
 * - Dashboard: tabla principal que muestra categorías con sus movimientos mensuales
 * - TransactionForm: selector de categoría al crear/editar movimientos
 * 
 * Características:
 * - Tiene presupuesto configurable con frecuencia (diario, semanal, mensual, anual)
 * - Se puede activar/desactivar sin eliminar
 * - Admite subcategorías opcionales (withSubcategory)
 * - Personalizable con icono y color
 */
export interface Category {
    categoryId: number          // Identificador único de la categoría
    name: string                 // Nombre descriptivo (ej: "Alimentación", "Salario")
    budget: string               // Presupuesto asignado (almacenado como string para precisión decimal)
    frequency: string            // Frecuencia del presupuesto en formato iCalendar RRULE (ej: "FREQ=MONTHLY;COUNT=1")
    dtstart: string              // Fecha de inicio del presupuesto (formato ISO)
    icon: string                 // Emoji que representa la categoría (ej: "🍔", "💰")
    type: 'income' | 'expense'   // Tipo: gasto (expense) o ingreso (income)
    color: string                // Color en formato hexadecimal para visualización (ej: "#FF5733")
    order: number                // Orden de visualización en listas
    isActive: boolean            // Si está activa (false = archivada pero no eliminada)
    withSubcategory: boolean     // Si permite crear subcategorías dentro de esta categoría
    createdAt?: string           // Fecha de creación (ISO)
    updatedAt?: string           // Fecha de última actualización (ISO)
    userId: number               // ID del usuario propietario
}

/**
 * Representa una subcategoría dentro de una categoría padre.
 * Permite dividir categorías amplias en segmentos más específicos.
 * Ejemplo: Categoría "Alimentación" → Subcategorías: "Supermercado", "Restaurantes", "Comida rápida"
 * 
 * Uso principal:
 * - SubcategoryForm: formulario para crear/editar subcategorías
 * - ViewSubcategoryModal: modal para ver transacciones de una subcategoría específica
 * - ViewCategoryModal: lista subcategorías dentro de la vista de categoría
 * - TransactionForm: selector opcional de subcategoría al crear movimientos
 * 
 * Nota: Solo existe si la categoría padre tiene withSubcategory=true
 */
export interface Subcategory {
    subcategoryId: number        // Identificador único de la subcategoría
    categoryId: number           // ID de la categoría padre a la que pertenece
    name: string                 // Nombre descriptivo (ej: "Supermercado", "Gasolina")
    description?: string         // Descripción opcional adicional
    budget: string               // Presupuesto asignado específico de la subcategoría
    color?: string               // Color personalizado (hereda de categoría si no se especifica)
    order?: number               // Orden de visualización dentro de su categoría
    isActive: boolean            // Si está activa (false = archivada)
    createdAt?: string           // Fecha de creación (ISO)
    updatedAt?: string           // Fecha de última actualización (ISO)
}

/**
 * Tipo unificado que representa tanto transacciones individuales como subcategorías.
 * Usado en la vista de categoría para mostrar una lista mixta de items.
 * 
 * Uso principal:
 * - ViewCategoryModal: tabla que combina transacciones directas y subcategorías
 * - CategoryTableRows: renderiza filas para ambos tipos de items
 * 
 * Permite:
 * - Mostrar transacciones sin subcategoría junto con subcategorías en una sola tabla
 * - Diferenciar el tipo mediante el campo 'type'
 * - Mantener referencia al objeto original (originalTransaction o originalSubcategory)
 */
export type CategoryItem = {
    id: string                           // Identificador único (transactionId o subcategoryId como string)
    type: 'transaction' | 'subcategory'  // Tipo de item para diferenciar en renderizado
    date: string                         // Fecha de la transacción o fecha de creación de subcategoría
    name: string                         // Nombre del movimiento o subcategoría
    budget: number                       // Monto de la transacción o presupuesto de subcategoría
    monthlyData: MonthlyData             // Datos mensuales agregados (montos por mes)
    color?: string                       // Color para visualización
    originalTransaction?: Transaction    // Objeto transacción original si type='transaction'
    originalSubcategory?: Subcategory    // Objeto subcategoría original si type='subcategory'
}
