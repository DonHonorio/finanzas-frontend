export enum BaseCurrency {
    AED = "AED", // Emiratos Árabes Unidos - Dirham
    ARS = "ARS", // Argentina - Peso
    AUD = "AUD", // Australia - Dólar
    BGN = "BGN", // Bulgaria - Lev
    BRL = "BRL", // Brasil - Real
    CAD = "CAD", // Canadá - Dólar
    CHF = "CHF", // Suiza - Franco
    CLP = "CLP", // Chile - Peso
    CNY = "CNY", // China - Yuan
    COP = "COP", // Colombia - Peso
    CZK = "CZK", // Chequia - Corona
    DKK = "DKK", // Dinamarca - Corona
    DOP = "DOP", // República Dominicana - Peso
    EGP = "EGP", // Egipto - Libra
    EUR = "EUR", // Unión Europea - Euro
    GBP = "GBP", // Reino Unido - Libra esterlina
    GHS = "GHS", // Ghana - Cedi
    HKD = "HKD", // Hong Kong - Dólar
    HUF = "HUF", // Hungría - Florín
    IDR = "IDR", // Indonesia - Rupia
    ILS = "ILS", // Israel - Shekel
    INR = "INR", // India - Rupia
    ISK = "ISK", // Islandia - Corona
    JPY = "JPY", // Japón - Yen
    KRW = "KRW", // Corea del Sur - Won
    MAD = "MAD", // Marruecos - Dirham
    MXN = "MXN", // México - Peso
    MYR = "MYR", // Malasia - Ringgit
    NOK = "NOK", // Noruega - Corona
    NZD = "NZD", // Nueva Zelanda - Dólar
    PEN = "PEN", // Perú - Sol
    PHP = "PHP", // Filipinas - Peso
    PKR = "PKR", // Pakistán - Rupia
    PLN = "PLN", // Polonia - Zloty
    RON = "RON", // Rumanía - Leu
    RUB = "RUB", // Rusia - Rublo
    SAR = "SAR", // Arabia Saudita - Riyal
    SEK = "SEK", // Suecia - Corona
    SGD = "SGD", // Singapur - Dólar
    THB = "THB", // Tailandia - Baht
    TRY = "TRY", // Turquía - Lira
    TWD = "TWD", // Taiwán - Dólar
    UAH = "UAH", // Ucrania - Hryvnia
    USD = "USD", // Estados Unidos - Dólar
    UYU = "UYU", // Uruguay - Peso
    VND = "VND", // Vietnam - Dong
    ZAR = "ZAR"  // Sudáfrica - Rand
}

export type BaseCurrencyValue = keyof typeof BaseCurrency

export interface Transaction {
    transactionId: string
    name: string
    date: string
    amount: number
    description?: string
    type: 'expense' | 'income'
    currency: BaseCurrencyValue
    createdAt: string
    updatedAt: string
    accountId: string
    categoryId: string
}