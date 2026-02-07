"use server";

import { getToken } from "../auth/token";
import { DraftTransactionSchema, ErrorResponseSchema, SuccessSchema } from "../schemas";
import { ActionStateType } from "../types/action-types";

export default async function updateTransaction(prevState: ActionStateType, formData: FormData) {
  const transactionId = formData.get("transactionId");
  const transactionData = {
    name: formData.get("name"),
    type: formData.get("type"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    description: formData.get("description"),
    accountId: formData.get("account"),
    categoryId: formData.get("category"),
  };

  const transaction = DraftTransactionSchema.safeParse(transactionData);
  if (!transaction.success) {
    return {
      errors: transaction.error._zod.def.map((issue) => issue.message),
      success: "",
    };
  }

  const token = await getToken();
  const previousCategoryId = formData.get("previousCategoryId");
  const url = `${process.env.API_URL}/categories/${previousCategoryId}/transactions/${transactionId}`;
  const req = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...transaction.data
    }),
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