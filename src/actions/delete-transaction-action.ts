"use server";

import { getToken } from "../auth/token";
import { ErrorResponseSchema, SuccessSchema } from "../schemas";
import { ActionStateType } from "../types/action-types";

export default async function deleteTransaction(prevState: ActionStateType, formData: FormData) {
  const transactionId = formData.get("transactionId");
  if (!transactionId) {
    return {
      errors: ["ID de transacción no proporcionado."],
      success: "",
    };
  }

  const token = await getToken();
  const url = `${process.env.API_URL}/transactions/${transactionId}`;
  const req = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await req.json();
  if (!req.ok) {
    const { error } = ErrorResponseSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  }

  const success = SuccessSchema.parse(json.message);
  return {
    errors: [],
    success,
  };
}