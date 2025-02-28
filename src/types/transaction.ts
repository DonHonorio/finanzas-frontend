export interface Transaction {
  transactionId: number,
  tipo: string,
  monto: number,
  fecha: Date,
  descripcion: string
}

export interface Balance {
  amount: number
  currency: string
  accountNumber?: string
}

