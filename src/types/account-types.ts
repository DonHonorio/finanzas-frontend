import { BaseCurrencyValue } from "./transaction-types";

export enum AccountType {
  AHORROS = "Ahorros",                    // Savings Account
  CORRIENTE = "Corriente",                // Checking/Current Account
  TARJETA_CREDITO = "Tarjeta de Crédito",// Credit Card
  TARJETA_DEBITO = "Tarjeta de Débito",  // Debit Card
  CUENTA_NOMINA = "Cuenta Nómina",       // Payroll Account
  MONEDERO = "Monedero / Wallet",        // eWallets (como PayPal, Revolut)
  INVERSIONES = "Inversiones",           // Investment Account
  FONDO_PENSION = "Fondo de Pensión",    // Retirement / Pension Fund
  CUENTA_EMPRESARIAL = "Cuenta Empresarial", // Business / Corporate Account
  CUENTA_CONJUNTA = "Cuenta Conjunta",   // Joint Account
  PRESTAMO = "Préstamo",                 // Loan Account
  HIPOTECA = "Hipoteca",                 // Mortgage
  LINEA_CREDITO = "Línea de Crédito",    // Credit Line
  OTRO = "Otro"                          // Other / Custom
}

type AccountTypeValue = keyof typeof AccountType

export interface Account {
    accountId: number
    name: string
    type: AccountTypeValue
    balance: string
    currency: BaseCurrencyValue
    number?: string
    order?: number
    isActive: boolean
    createdAt?: string
    updatedAt?: string
    userId: number
    bankId: number
}
