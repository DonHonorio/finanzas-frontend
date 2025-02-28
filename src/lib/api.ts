import type { Transaction, Balance } from "../types/transaction"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTransactions(): Promise<Transaction[]> {
  // Simulate API call
  try {
    console.log("API_URL: " + API_URL);
    const response = await fetch(API_URL + "/api/transactions");
    return response.json()
  } catch (error) {
    console.error("Error al fetch: ", error)
    return [];
  }
}

export async function fetchBalance(): Promise<Balance> {
  // Simulate API call
  const response = await fetch("/api/balance")
  return response.json()
}

