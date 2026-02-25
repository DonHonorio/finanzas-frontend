import { verifySession } from "@/src/auth/dal"
import { CuentasPageClient } from "@/src/components/pages/cuentas-page-client"

export default async function CuentasPage() {
    const user = await verifySession()
    
    return <CuentasPageClient user={user?.user} source={user?.source ?? "none"} />
}
