"use server"

import { getToken } from "../auth/token"
import { DraftAccountSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function createAccount(prevState: ActionStateType, formData: FormData) {
  const accountData = {
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance"),
    currency: formData.get("currency"),
    number: formData.get("number"),
    order: formData.get("order"),
    isActive: String(formData.get("isActive") ?? "true") === "true",
    bankId: formData.get("bankId") ?? "1",
  }

  const account = DraftAccountSchema.safeParse(accountData)
  if (!account.success) {
    return {
      errors: account.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  const token = await getToken()
  if (!token) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: "",
    }
  }

  const req = await fetch(`${process.env.API_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(account.data),
  })

  const json = await req.json().catch(() => ({}))

  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo crear la cuenta.")],
      success: "",
    }
  }

  return {
    errors: [],
    success: getActionSuccessMessage(json, "Cuenta creada exitosamente"),
  }
}
