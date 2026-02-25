import { getSessionType } from "./session"
import { getDashboardData as getDashboardDataLocal } from "@/src/indexdb/dashboard"
import { getDashboardAction } from "@/src/actions/get-dashboard-action"
import { CategoryRow } from "@/src/types/dashboard-types"

// Punto único para obtener dashboard desde backend o IndexedDB local.
export async function getDashboardData(type: "expenses" | "incomes", year: number): Promise<CategoryRow[]> {
  const sessionType = await getSessionType()

  if (sessionType === "backend") return getDashboardAction(type, year)
  if (sessionType === "local") return getDashboardDataLocal(type, year)

  throw new Error("SESSION_NONE")
}
