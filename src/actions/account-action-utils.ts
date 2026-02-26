import { ErrorResponseSchema, SuccessSchema } from "../schemas"

type GenericJson = Record<string, unknown>

function asObject(value: unknown): GenericJson | null {
  if (!value || typeof value !== "object") return null
  return value as GenericJson
}

export function getActionErrorMessage(json: unknown, fallback: string) {
  const parsed = ErrorResponseSchema.safeParse(json)
  if (parsed.success) return parsed.data.error

  const data = asObject(json)
  if (!data) return fallback

  if (typeof data.message === "string" && data.message.trim().length > 0) {
    return data.message
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const firstError = data.errors[0]
    if (typeof firstError === "string") return firstError
    if (firstError && typeof firstError === "object" && "msg" in firstError && typeof firstError.msg === "string") {
      return firstError.msg
    }
  }

  return fallback
}

export function getActionSuccessMessage(json: unknown, fallback: string) {
  const data = asObject(json)
  const message = typeof data?.message === "string" ? data.message : fallback
  const parsed = SuccessSchema.safeParse(message)
  return parsed.success ? parsed.data : fallback
}
