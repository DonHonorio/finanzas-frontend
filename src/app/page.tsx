import { Button } from "@/components/ui/button"
import { BalanceCard } from "@/components/balance-card"
import { TransactionList } from "@/components/transaction-list"
import { Home, CreditCard, Users, Settings } from "lucide-react"
import { fetchTransactions } from "@/lib/api"

// const mockTransactions: Transaction[] = [
//     {
//         id: "1",
//         type: "incoming",
//         amount: 80,
//         currency: "EUR",
//         description: "HONORIO CONESA ACOSTA",
//         date: "Thursday",
//     },
//     {
//         id: "2",
//         type: "outgoing",
//         amount: 80,
//         currency: "EUR",
//         description: "Clinica Dental",
//         date: "Thursday",
//     },
// ]

const transactions = await fetchTransactions();
console.log('pasa por aqui');

const mockBalances = [
    {
        amount: 349.16,
        currency: "EUR",
        accountNumber: "2 7349",
    },
    {
        amount: 882.78,
        currency: "GBP",
    },
]

export default function Page() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-md mx-auto p-4 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-muted" />
                    <div className="text-2xl font-bold">
                        {mockBalances.reduce((acc, balance) => acc + balance.amount, 0).toFixed(2)} EUR
                    </div>
                </div>

                <div className="flex gap-4 mb-8">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600">Send</Button>
                    <Button variant="outline" className="flex-1">
                        Add money
                    </Button>
                    <Button variant="outline" className="flex-1">
                        Request
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {mockBalances.map((balance, i) => (
                        <BalanceCard key={i} balance={balance} />
                    ))}
                </div>

                <TransactionList transactions_={transactions} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
                <div className="container max-w-md mx-auto">
                    <div className="flex justify-between p-4">
                        <Button variant="ghost" className="flex-col gap-1">
                            <Home className="w-5 h-5" />
                            <span className="text-xs">Home</span>
                        </Button>
                        <Button variant="ghost" className="flex-col gap-1">
                            <CreditCard className="w-5 h-5" />
                            <span className="text-xs">Card</span>
                        </Button>
                        <Button variant="ghost" className="flex-col gap-1">
                            <Users className="w-5 h-5" />
                            <span className="text-xs">Recipients</span>
                        </Button>
                        <Button variant="ghost" className="flex-col gap-1">
                            <Settings className="w-5 h-5" />
                            <span className="text-xs">Payments</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

