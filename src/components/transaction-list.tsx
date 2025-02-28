'use client'

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import type { Transaction } from "@/types/transaction"
import { cn } from "@/lib/utils"
import { fetchTransactions } from "@/lib/api"
import { useState } from "react"

interface TransactionListProps {
  transactions_: Transaction[]
}

const getTransactions = async () => {
  const data = await fetchTransactions();
  console.log(data);
  return data;
};

export function TransactionList({ transactions_ }: TransactionListProps) {

  const [transactions, setTransactions] = useState(transactions_);

  const handleGetTransactions = async () => {
    console.log("Getting transactions");
    const data = await getTransactions();
    setTransactions(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        <button className="text-sm text-primary hover:underline"
          onClick={handleGetTransactions}
          >See all</button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.transactionId} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {transaction.tipo === "ingreso" ? (
                  <ArrowDownIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowUpIcon className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div>
                <div className="font-medium">{transaction.descripcion}</div>
                <div className="text-sm text-muted-foreground">{transaction.fecha.toString()}</div>
              </div>
            </div>
            <div className={cn("font-medium", transaction.tipo === "ingreso" ? "text-green-600" : "text-red-600")}>
              {transaction.tipo === "ingreso" ? "+" : "-"}
              {transaction.monto} $
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

