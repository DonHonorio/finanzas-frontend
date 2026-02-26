import { verifySession } from "@/src/auth/dal"
import { HomePageClient } from "@/src/components/pages/home-page-client"
import { getTranslations } from "next-intl/server"

export default async function Home() {
  const session = await verifySession(false)
  const t = await getTranslations("HomePage")
  
  return <HomePageClient user={session?.user} source={session?.source ?? "none"} title={t("title")} />
}
