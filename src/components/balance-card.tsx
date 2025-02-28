import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { Balance } from "@/types/transaction"

interface BalanceCardProps {
  balance: Balance
  className?: string
}

export function BalanceCard({ balance, className }: BalanceCardProps) {
  return (
    <Card className={cn("bg-muted/50", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          {balance.currency === "EUR" ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-02-08-03-09-35-54_1df3759c43ef3bc53b6c1b2b7c62a157.jpg-YCuLERNW125LQx9CNqd7wDCXHqwuvG.jpeg"
                alt="EU Flag"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-yellow-400 rounded-full" />
          )}
          <span className="text-lg font-medium">{balance.currency}</span>
        </div>
        {balance.accountNumber && <div className="text-sm text-muted-foreground mb-2">·· {balance.accountNumber}</div>}
        <div className="text-2xl font-bold">{balance.amount.toFixed(2)}</div>
      </CardContent>
    </Card>
  )
}

