import ToastNotification from "@/src/components/ui/ToastNotification"
import { VistaMensualPageClient } from "@/src/components/vista-mensual/page-client"

export default function Page() {
  // Devuelve un componente para usar funcionalidades de cliente
  return (
    <>
      <VistaMensualPageClient />
      <ToastNotification />
    </>
  )
}
