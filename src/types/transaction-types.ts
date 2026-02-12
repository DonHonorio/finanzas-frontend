/**
 * Tipo que define todas las monedas soportadas en el sistema.
 * Incluye las principales monedas internacionales y algunas regionales.
 * 
 * Uso principal:
 * - Account: cada cuenta bancaria tiene una moneda asociada
 * - Transaction: cada transacción se registra en la moneda de su cuenta
 * - CurrencySelector: selector de divisa al crear transacciones sin cuenta
 * 
 * Nota: Las transacciones heredan la moneda de la cuenta seleccionada.
 * La lista currencies (abajo) proporciona descripciones legibles para UI.
 */
export type BaseCurrency = 
    | "USD" | "EUR" | "GBP" | "JPY" | "RUB" | "CNY" | "CAD" | "AUD" 
    | "CHF" | "INR" | "MXN" | "BRL" | "SGD" | "HKD" | "NOK" | "SEK" 
    | "KRW" | "COP" | "ARS" | "ZAR" | "CLP" | "PEN" | "NZD" | "IDR" 
    | "MYR" | "PHP" | "THB" | "DKK" | "PLN" | "CZK" | "TRY" | "HUF" 
    | "ILS" | "SAR" | "AED" | "PKR" | "BGN" | "RON" | "DOP" | "EGP" 
    | "GHS" | "ISK" | "MAD" | "TWD" | "UAH" | "UYU" | "VND"

/**
 * Array de objetos con código de moneda y su descripción en español.
 * Usado para poblar selectores de divisa en la interfaz.
 * 
 * Uso principal:
 * - CurrencySelector: desplegable para seleccionar moneda al crear transacciones
 * - AccountSelector: muestra "nombre - moneda" en cada opción de cuenta
 * 
 * Formato: { currency: código ISO 4217, description: "País - Nombre moneda" }
 */
export const currencies: { currency: BaseCurrency; description: string }[] = [
    { currency: "USD", description: "Estados Unidos - Dólar" },
    { currency: "EUR", description: "Unión Europea - Euro" },
    { currency: "GBP", description: "Reino Unido - Libra esterlina" },
    { currency: "JPY", description: "Japón - Yen" },
    { currency: "RUB", description: "Rusia - Rublo" },
    { currency: "CNY", description: "China - Yuan" },
    { currency: "CAD", description: "Canadá - Dólar" },
    { currency: "AUD", description: "Australia - Dólar" },
    { currency: "CHF", description: "Suiza - Franco" },
    { currency: "INR", description: "India - Rupia" },
    { currency: "MXN", description: "México - Peso" },
    { currency: "BRL", description: "Brasil - Real" },
    { currency: "SGD", description: "Singapur - Dólar" },
    { currency: "HKD", description: "Hong Kong - Dólar" },
    { currency: "NOK", description: "Noruega - Corona" },
    { currency: "SEK", description: "Suecia - Corona" },
    { currency: "KRW", description: "Corea del Sur - Won" },
    { currency: "COP", description: "Colombia - Peso" },
    { currency: "ARS", description: "Argentina - Peso" },
    { currency: "ZAR", description: "Sudáfrica - Rand" },
    { currency: "CLP", description: "Chile - Peso" },
    { currency: "PEN", description: "Perú - Sol" },
    { currency: "NZD", description: "Nueva Zelanda - Dólar" },
    { currency: "IDR", description: "Indonesia - Rupia" },
    { currency: "MYR", description: "Malasia - Ringgit" },
    { currency: "PHP", description: "Filipinas - Peso" },
    { currency: "THB", description: "Tailandia - Baht" },
    { currency: "DKK", description: "Dinamarca - Corona" },
    { currency: "PLN", description: "Polonia - Zloty" },
    { currency: "CZK", description: "Chequia - Corona" },
    { currency: "TRY", description: "Turquía - Lira" },
    { currency: "HUF", description: "Hungría - Florín" },
    { currency: "ILS", description: "Israel - Shekel" },
    { currency: "SAR", description: "Arabia Saudita - Riyal" },
    { currency: "AED", description: "Emiratos Árabes Unidos - Dirham" },
    { currency: "PKR", description: "Pakistán - Rupia" },
    { currency: "BGN", description: "Bulgaria - Lev" },
    { currency: "RON", description: "Rumanía - Leu" },
    { currency: "DOP", description: "República Dominicana - Peso" },
    { currency: "EGP", description: "Egipto - Libra" },
    { currency: "GHS", description: "Ghana - Cedi" },
    { currency: "ISK", description: "Islandia - Corona" },
    { currency: "MAD", description: "Marruecos - Dirham" },
    { currency: "TWD", description: "Taiwán - Dólar" },
    { currency: "UAH", description: "Ucrania - Hryvnia" },
    { currency: "UYU", description: "Uruguay - Peso" },
    { currency: "VND", description: "Vietnam - Dong" }
]

/**
 * Representa un movimiento financiero individual (gasto o ingreso).
 * Es la unidad básica de registro en el sistema.
 * 
 * Uso principal:
 * - TransactionForm: formulario para crear/editar movimientos
 * - ViewCategoryModal: lista transacciones dentro de una categoría
 * - ViewSubcategoryModal: lista transacciones de una subcategoría
 * - Dashboard: agregación de transacciones por categoría y mes
 * - EditTransactionModal: modal para editar transacción existente
 * 
 * Relaciones:
 * - Pertenece a una Account (cuenta bancaria)
 * - Se clasifica en una Category
 * - Opcionalmente en una Subcategory
 */
export interface Transaction {
    transactionId: string        // Identificador único de la transacción
    name: string                 // Nombre descriptivo del movimiento (ej: "Compra supermercado")
    date: string                 // Fecha del movimiento en formato ISO
    amount: number               // Monto (positivo para ingresos, negativo para gastos)
    description?: string         // Descripción opcional adicional (máx 500 caracteres)
    type: 'expense' | 'income'   // Tipo: gasto o ingreso
    currency: BaseCurrency       // Moneda del movimiento (heredada de la cuenta)
    createdAt: string            // Fecha de creación del registro (ISO)
    updatedAt: string            // Fecha de última actualización (ISO)
    accountId: string            // ID de la cuenta bancaria asociada
    categoryId: string           // ID de la categoría en la que se clasifica
    subcategoryId?: number       // ID de la subcategoría (opcional)
}