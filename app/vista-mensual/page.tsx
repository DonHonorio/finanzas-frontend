import ToastNotification from "@/src/components/ui/ToastNotification"
import { VistaMensualPageClient } from "@/src/components/vista-mensual/page-client"
import { verifySession } from "@/src/auth/dal"

export default async function VistaMensualPage() {
  const user = await verifySession()
  
  return (
    <>
      <VistaMensualPageClient user={user?.user} source={user?.source ?? "none"} />
      <ToastNotification />
    </>
  )
}
