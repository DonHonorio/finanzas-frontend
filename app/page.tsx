import { verifySession } from "@/src/auth/dal"
import { HomePageClient } from "@/src/components/pages/home-page-client"

export default async function Home() {
  const session = await verifySession(false)
  
  return <HomePageClient user={session?.user} />
}
