import z from "zod";
import { rrulestr } from "rrule"
import { BaseCurrency } from "../types/transaction-types";
import { AccountType } from "../types/account-types";

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
})

export const DraftTransactionSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede superar 50 caracteres"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha no es válida" }),
    amount: z
        .string()
        .refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0;
        }, { message: "La cantidad debe ser un número positivo válido" }),
    description: z.string().max(500, "La descripción no puede superar los 500 caracteres").optional(),
    type: z.enum(["income", "expense"], { message: "El tipo de transacción es obligatorio" }),
    currency: z.enum(Object.values(BaseCurrency) as [string, ...string[]], { message: "La moneda es obligatoria" }),
    accountId: z.string().min(1, "La cuenta es obligatoria"),
    categoryId: z.string().min(1, "La categoría es obligatoria")
});

export const DraftAccountSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no puede superar 100 caracteres"),
    type: z.enum(Object.values(AccountType) as [string, ...string[]], { message: "El tipo de cuenta es inválido" }),
    balance: z
        .string()
        .refine((val) => {
            const num = Number(val)
            return !isNaN(num)
        }, { message: "El saldo debe ser un número válido" })
        .refine((val) => {
            return /^\d+(\.\d{1,2})?$/.test(val)
        }, { message: "El saldo debe tener máximo 2 decimales" }),
    currency: z.enum(Object.values(BaseCurrency) as [string, ...string[]], { message: "La moneda es obligatoria" }),
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