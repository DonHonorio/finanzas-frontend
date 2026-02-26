import z from "zod"
import { rrulestr } from "rrule"
import { AccountType } from "../types/account-types"
import { BaseCurrency, currencies } from "../types/transaction-types"

const CURRENCY_VALUES = currencies.map(c => c.currency) as [BaseCurrency, ...BaseCurrency[]]
const ACCOUNT_TYPE_VALUES = Object.values(AccountType) as [string, ...string[]]
const ACCOUNT_TYPE_KEYS = Object.keys(AccountType) as [keyof typeof AccountType, ...(keyof typeof AccountType)[]]

// Esquema para respuestas de éxito de la API
export const SuccessSchema = z.string()
// Esquemas para respuestas de errores de la API
export const ErrorResponseSchema = z.object({
    error: z.string()
})

// Esquemas de entidades de la aplicación

// Esquema para la creación/edición de una categoría (borrador antes de ser guardado en BD)
export const DraftCategorySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede superar 50 caracteres"),
    budget: z
        .string()
        .refine((val) => {
            const num = Number(val)
            return !isNaN(num) && num >= 0
        }, { message: "El presupuesto debe ser un número válido" }),
    frequency: z
        .string()
        .min(1, "La frecuencia es obligatoria")
        .max(200, "La frecuencia es demasiado larga")
        .refine((val) => {
            try {
                rrulestr(val)
                return true
            } catch {
                return false
            }
        }, { message: "Regla de recurrencia inválida" }),
    dtstart: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha de inicio no es válida" }),
    type: z.enum(["income", "expense"]),
    icon: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.string().max(100, "El icono es demasiado largo").optional()
    ),
    color: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.string().regex(/^#[0-9A-Fa-f]{6}$/, "El color debe ser hexadecimal").optional()
    ),
    order: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.coerce.number().int("El orden debe ser un número entero").optional()
    ),
    isActive: z.boolean(),
    withSubcategory: z.boolean(),
})

// Esquema para la creación/edición de una transacción (borrador antes de ser guardado en BD)
export const DraftTransactionSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede superar 50 caracteres"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha no es válida" }),
    amount: z
        .string()
        .pipe(z.string().refine((val) => {
            const num = Number(val)
            return !isNaN(num) && num > 0
        }, { message: "La cantidad debe ser un número positivo válido" }))
        .pipe(z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), { message: "La cantidad debe tener máximo 2 decimales" }))
        .pipe(z.string().refine((val) => {
            const parts = val.split('.')
            return parts[0].length <= 18
        }, { message: "La cantidad excede el límite de dígitos permitidos" })),
    description: z.string().max(500, "La descripción no puede superar los 500 caracteres").optional(),
    type: z.enum(["income", "expense"], { message: "El tipo de transacción es obligatorio" }),
    currency: z.enum(CURRENCY_VALUES, { message: "La moneda es obligatoria" }),
    accountId: z.string().min(1, "La cuenta es obligatoria"),
    categoryId: z.string().min(1, "La categoría es obligatoria"),
    subcategoryId: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? null : val),
        z.string().nullable().optional()
    ),
})

// Esquema para la creación/edición de una cuenta (borrador antes de ser guardado en BD)
export const DraftAccountSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no puede superar 100 caracteres"),
    type: z.union([
        z.enum(ACCOUNT_TYPE_VALUES, { message: "El tipo de cuenta es inválido" }),
        z.enum(ACCOUNT_TYPE_KEYS, { message: "El tipo de cuenta es inválido" })
    ]).transform((value) => value in AccountType ? AccountType[value as keyof typeof AccountType] : value),
    balance: z
        .string()
        .refine((val) => !isNaN(Number(val)), { message: "El saldo debe ser un número válido" })
        .pipe(z.string().refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), { message: "El saldo debe tener máximo 2 decimales" }))
        .pipe(z.string().refine((val) => {
            const parts = val.split('.')
            const intPart = parts[0].replace('-', '')
            return intPart.length <= 18
        }, { message: "El saldo excede el límite de dígitos permitidos" })),
    currency: z.enum(CURRENCY_VALUES, { message: "La moneda es obligatoria" }),
    number: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.string().max(4, "Solo se admiten los últimos 4 dígitos").optional()
    ),
    order: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.coerce.number().int("El orden debe ser un número entero").optional()
    ),
    isActive: z.boolean(),
    bankId: z.coerce.number().int("El banco es obligatorio").min(1, "Debes seleccionar un banco válido")
})

// Esquema para la creación/edición de una subcategoría (borrador antes de ser guardado en BD)
export const DraftSubcategorySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede superar 50 caracteres"),
    description: z.string().max(255, "La descripción no puede superar 255 caracteres").optional(),
    budget: z
        .string()
        .pipe(z.string().refine((val) => {
            const num = Number(val)
            return !isNaN(num) && num >= 0
        }, { message: "El presupuesto debe ser un número válido no negativo" }))
        .pipe(z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), { message: "El presupuesto debe tener máximo 2 decimales" }))
        .pipe(z.string().refine((val) => {
            const parts = val.split('.')
            return parts[0].length <= 18
        }, { message: "El presupuesto excede el límite de dígitos permitidos" })),
    color: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.string().regex(/^#[0-9A-Fa-f]{6}$/, "El color debe ser hexadecimal").optional()
    ),
    order: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? undefined : val),
        z.coerce.number().int("El orden debe ser un número entero").optional()
    ),
    isActive: z.boolean(),
    categoryId: z.coerce.number().int("El ID de categoría debe ser un número entero").optional(),
})

// Esquema para inicio de sesión
export const LoginSchema = z.object({
    email: z.email("El email no es válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
})

// Esquema para crear una cuenta (registro)
export const CreateAccountSchema = z.object({
    email: z.email("El email no es válido"),
    name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede superar 50 caracteres"),
    fullName: z.string().min(1, "El nombre completo es obligatorio").max(120, "El nombre completo no puede superar 120 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    baseCurrency: z.enum(CURRENCY_VALUES, { message: "La moneda base es obligatoria" }),
    timeZone: z.string().min(1, "La zona horaria es obligatoria"),
})

// Esquema para el usuario autenticado
export const UserSchema = z.object({
    userId: z.number(),
    email: z.email("El email no es válido").max(50, "El email no puede superar 50 caracteres"),
    name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede superar 50 caracteres"),
    fullName: z.string().min(1, "El nombre completo es obligatorio").max(120, "El nombre completo no puede superar 120 caracteres"),
    avatar: z.preprocess(
        (val) => (typeof val === "string" && val.trim().length === 0 ? null : val),
        z.string().max(2500, "La URL del avatar es demasiado larga").nullable().optional()
    ),
    baseCurrency: z.enum(CURRENCY_VALUES, { message: "La moneda base es obligatoria" }),
    timeZone: z.string().min(1, "La zona horaria es obligatoria").max(100, "La zona horaria no puede superar 100 caracteres"),
    isActive: z.boolean(),
})

// Esquema para actualizar usuario (campos editables) - basado en UserSchema
export const UpdateUserSchema = UserSchema.pick({
    name: true,
    fullName: true,
    email: true,
    baseCurrency: true,
    timeZone: true,
    avatar: true,
})
