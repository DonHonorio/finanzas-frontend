import { verifySession } from "@/src/auth/dal"
import { PatrimonioPageClient } from "@/src/components/pages/patrimonio-page-client"

export default async function PatrimonioPage() {
    const user = await verifySession()
    
    return <PatrimonioPageClient user={user?.user} />
}
