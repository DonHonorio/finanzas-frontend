/**
 * Estructura de datos que contiene valores numéricos para cada mes del año.
 * Usado para almacenar y visualizar información mensual agregada.
 * 
 * Uso principal:
 * - Dashboard: muestra montos gastados/ingresados por mes en cada categoría
 * - ViewCategoryModal: filas de transacciones con montos distribuidos mensualmente
 * - CategoryTableRows: renderizado de celdas mensuales en la tabla
 * 
 * Cada propiedad representa un mes y contiene el monto total de ese mes.
 * Facilita la visualización en tablas donde cada columna es un mes.
 */
export type MonthlyData = {
    enero: number       // Monto total de enero
    febrero: number     // Monto total de febrero
    marzo: number       // Monto total de marzo
    abril: number       // Monto total de abril
    mayo: number        // Monto total de mayo
    junio: number       // Monto total de junio
    julio: number       // Monto total de julio
    agosto: number      // Monto total de agosto
    septiembre: number  // Monto total de septiembre
    octubre: number     // Monto total de octubre
    noviembre: number   // Monto total de noviembre
    diciembre: number   // Monto total de diciembre
}

/**
 * Configuración de columnas redimensionables en tablas interactivas.
 * Define el ancho inicial y el ancho mínimo permitido para cada columna.
 * 
 * Uso principal:
 * - ViewCategoryModal: configuración de columnas (Fecha, Nombre, Monto)
 * - ViewSubcategoryModal: configuración similar para tabla de subcategorías
 * - useColumnResize: hook que gestiona el redimensionamiento usando esta config
 * 
 * Los valores están en porcentaje (%) del ancho total disponible.
 */
export type ColumnConfig = {
    initial: number  // Ancho inicial de la columna en porcentaje (ej: 60 = 60%)
    min: number      // Ancho mínimo permitido al redimensionar (ej: 20 = 20%)
}
