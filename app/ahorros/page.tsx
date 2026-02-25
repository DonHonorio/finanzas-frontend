import { verifySession } from "@/src/auth/dal"
import { AhorrosPageClient } from "@/src/components/pages/ahorros-page-client"

export default async function AhorrosPage() {
    const user = await verifySession()
    
    return <AhorrosPageClient user={user?.user} source={user?.source ?? "none"} />
}
