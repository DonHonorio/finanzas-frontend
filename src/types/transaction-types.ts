// Definición de tipos relacionados con transacciones, incluyendo la lista de monedas comunes y la interfaz para una transacción
export type BaseCurrency = 
    | "USD" | "EUR" | "GBP" | "JPY" | "RUB" | "CNY" | "CAD" | "AUD" 
    | "CHF" | "INR" | "MXN" | "BRL" | "SGD" | "HKD" | "NOK" | "SEK" 
    | "KRW" | "COP" | "ARS" | "ZAR" | "CLP" | "PEN" | "NZD" | "IDR" 
    | "MYR" | "PHP" | "THB" | "DKK" | "PLN" | "CZK" | "TRY" | "HUF" 
    | "ILS" | "SAR" | "AED" | "PKR" | "BGN" | "RON" | "DOP" | "EGP" 
    | "GHS" | "ISK" | "MAD" | "TWD" | "UAH" | "UYU" | "VND"

// Lista de monedas comunes para usar en el sistema, con su descripción para mostrar en la UI
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

export interface Transaction {
    transactionId: string
    name: string
    date: string
    amount: number
    description?: string
    type: 'expense' | 'income'
    currency: BaseCurrency
    createdAt: string
    updatedAt: string
    accountId: string
    categoryId: string
}