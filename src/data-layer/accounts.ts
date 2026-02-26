import { ActionStateType } from "@/src/types/action-types"

type SessionType = "backend" | "local" | "none"

async function resolveSessionType(): Promise<SessionType> {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("localToken") ? "local" : "backend"
  }

  const { getSessionType } = await import("./session")
  return getSessionType()
}

function assertClientForLocalSession(sessionType: SessionType) {
  if (sessionType === "local" && typeof window === "undefined") {
    throw new Error("LOCAL_SESSION_REQUIRES_CLIENT")
  }
}

export async function getAccounts() {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { getAccounts } = await import("@/src/actions/get-accounts-action")
    return getAccounts()
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { getAccounts } = await import("@/src/indexdb/accounts")
    return getAccounts()
  }

  throw new Error("SESSION_NONE")
}

export async function createAccount(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: createAccount } = await import("@/src/actions/create-financial-account-action")
    return createAccount(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { createAccount } = await import("@/src/indexdb/accounts")
    return createAccount(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

export async function updateAccount(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: updateAccount } = await import("@/src/actions/update-financial-account-action")
    return updateAccount(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { updateAccount } = await import("@/src/indexdb/accounts")
    return updateAccount(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

export async function deleteAccount(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: deleteAccount } = await import("@/src/actions/delete-financial-account-action")
    return deleteAccount(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { deleteAccount } = await import("@/src/indexdb/accounts")
    return deleteAccount(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}

export async function toggleAccountActive(prevState: ActionStateType, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { default: toggleAccountActive } = await import("@/src/actions/toggle-account-active-action")
    return toggleAccountActive(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { toggleAccountActive } = await import("@/src/indexdb/accounts")
    return toggleAccountActive(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}
