import { BaseCurrency } from "./transaction-types"

/**
 * Enumeración de tipos de cuentas bancarias y financieras soportadas.
 * Define categorías predefinidas para clasificar cuentas del usuario.
 * 
 * Uso principal:
 * - Account: cada cuenta tiene un tipo asociado
 * - Formularios de cuentas: selector de tipo al crear/editar cuentas
 * - Filtrado y organización: agrupar cuentas por tipo
 * 
 * Incluye cuentas tradicionales (ahorros, corriente), tarjetas, monederos
 * digitales, inversiones, préstamos, etc.
 */
export enum AccountType {
  AHORROS = "Ahorros",                      // Cuenta de ahorros tradicional
  CORRIENTE = "Corriente",                  // Cuenta corriente / cheques
  TARJETA_CREDITO = "Tarjeta de Crédito",  // Tarjeta de crédito (deuda)
  TARJETA_DEBITO = "Tarjeta de Débito",    // Tarjeta de débito vinculada
  CUENTA_NOMINA = "Cuenta Nómina",         // Cuenta donde se recibe salario
  MONEDERO = "Monedero / Wallet",          // Monederos digitales (PayPal, Revolut, etc.)
  INVERSIONES = "Inversiones",             // Cuenta de inversiones
  FONDO_PENSION = "Fondo de Pensión",      // Fondo de jubilación/pensión
  CUENTA_EMPRESARIAL = "Cuenta Empresarial", // Cuenta de negocio
  CUENTA_CONJUNTA = "Cuenta Conjunta",     // Cuenta compartida con otra persona
  PRESTAMO = "Préstamo",                   // Préstamo personal
  HIPOTECA = "Hipoteca",                   // Préstamo hipotecario
  LINEA_CREDITO = "Línea de Crédito",      // Línea de crédito flexible
  OTRO = "Otro"                            // Otro tipo no categorizado
}

/**
 * Tipo auxiliar que extrae las claves del enum AccountType.
 * Usado para tipar el campo 'type' en Account.
 */
type AccountTypeValue = keyof typeof AccountType

/**
 * Representa una cuenta bancaria o financiera del usuario.
 * Agrupa transacciones que ocurren en el mismo medio de pago.
 * 
 * Uso principal:
 * - AccountSelector: selector de cuenta al crear transacciones
 * - TransactionForm: vincula cada movimiento a una cuenta
 * - Balance general: suma de saldos de todas las cuentas activas
 * - Formularios de cuenta: crear/editar cuentas
 * 
 * Características:
 * - Cada cuenta tiene una moneda única e inmutable (se podrá cambiar la moneda en un futuro)
 * - Las transacciones heredan la moneda de su cuenta
 * - Se puede activar/desactivar sin eliminar
 * - Vinculada a un banco (bankId)
 */
export interface Account {
  accountId: number          // Identificador único de la cuenta
  name: string               // Nombre personalizado (ej: "BBVA Nómina", "Tarjeta Visa")
  type: AccountTypeValue     // Tipo de cuenta (uno de los valores de AccountType enum)
  balance: string            // Saldo actual (string para precisión decimal)
  currency: BaseCurrency     // Moneda de la cuenta (inmutable, define moneda de transacciones)
  number?: string            // Número de cuenta o últimos dígitos (opcional)
  order?: number             // Orden de visualización en listas
  isActive: boolean          // Si está activa (false = archivada pero no eliminada)
  createdAt?: string         // Fecha de creación (ISO)
  updatedAt?: string         // Fecha de última actualización (ISO)
  userId: number             // ID del usuario propietario
  bankId: number             // ID del banco al que pertenece la cuenta
}
